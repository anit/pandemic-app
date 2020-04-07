import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import * as moment from 'moment';
import admin = require('firebase-admin');

export const scheduledCovid19Scrapper = functions.pubsub.schedule('every 12 hours').onRun(() => {
    admin.initializeApp();

    let rawPatientData: Array<any> = [];
    return fetch('https://api.covid19india.org/raw_data.json')
        .then((res:any) => res.json())
        .then((doc:any) => doc.raw_data)
        .then((data: Array<any>) => {
            rawPatientData = data;
            return data.filter(item => item.detectedstate && item.patientnumber).map(item => ({
                patientId: item.patientnumber,
                city: item.detectedcity,
                district: item.detecteddistrict,
                state: item.detectedstate,
                gender: item.gender,
                age: item.agebracket,
                status: item.currentstatus,
                notes: item.backupnotes,
                created: item.dateannounced && moment(item.dateannounced, 'dd/mm/yyyy').unix(),
                lastUpdated: item.statuschangedate && moment(item.statuschangedate, 'dd/mm/yyyy').unix(),
                sources: [ item.source1, item.source2, item.source3 ].filter(s => !!s)
            }))
        })
        .then((data:Array<any>) => {
            const chunks = [], chunkSize = 500;
            while (data.length > 0)
                chunks.push(data.splice(0, chunkSize));

            return Promise.all(chunks.map(chunk => batchWrite(chunk)))
        })

        // fetch states data
        .then(_ => fetch('https://api.covid19india.org/data.json'))
        .then((res:any) => res.json())
        .then((data:any) => data.statewise)
        .then(stateData =>  updateStateStats(stateData))

        // fetch district stats
        .then(_ =>  updateCityStats(rawPatientData))

})

const updateStateStats = (stateData: Array<any>) => {
    const writeBatch = admin.firestore().batch();
    stateData.forEach(item => {
        const docRef = admin.firestore().doc(`stateStats/${item.state}`)
        writeBatch.set(docRef, {
            dead: item.deaths,
            positive: item.active,
            recovered: item.recovered,
            lastUpdated: item.lastupdatedtime
        })
    })
    return writeBatch.commit();
}

const batchWrite = (data: Array<any>) => {
    const writeBatch = admin.firestore().batch();
    data.forEach((item:any) => {
        const docRef = admin.firestore().doc(`patients/${item.patientId}`);
        writeBatch.set(docRef, item)
    });
    return writeBatch.commit();
}

const updateCityStats = (patients: Array<any>) => {
    let statsColl:any = {}
    patients.forEach(pat => {
        let statsObj = statsColl[pat['detecteddistrict']] || { recovered: 0, dead: 0, positive: 0, unknown: 0 }
        switch (pat.currentstatus) {
            case 'Recovered':
                statsObj.recovered++;
                break;
            
            case 'Hospitalized': 
            case 'Hospitalised':
                statsObj.positive++;
                break;
            
            case 'Deceased':
                statsObj.dead++;
                break;
            
            default:
                statsObj.unknown++;
        }
        statsColl[pat['detecteddistrict']] = statsObj;
    });

    const writeBatch = admin.firestore().batch();
    for(const key in statsColl) {
        const documentPath = `districtStats/${key || 'unknown'}`
        const docRef = admin.firestore().doc(documentPath);
        writeBatch.set(docRef, statsColl[key])
    }

    return writeBatch.commit();
}