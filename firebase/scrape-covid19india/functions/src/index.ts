import * as functions from 'firebase-functions';
import fetch from 'node-fetch';
import admin = require('firebase-admin');

export const scheduledCovid19Scrapper = functions.pubsub.schedule('every 6 hours').onRun(() => {
    admin.initializeApp();

    return fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org')
        .then((res:any) => res.json())
        .then((doc:any) => doc.data.rawPatientData)
        .then((data:Array<any>) => {
            const chunks = [], chunkSize = 500;
            while (data.length > 0)
                chunks.push(data.splice(0, chunkSize));

            return Promise.all(chunks.map(chunk => batchWrite(chunk)))
        })
        .catch(err => console.log('General error ', err))

})

function batchWrite (data: Array<any>) {
    const writeBatch = admin.firestore().batch();
    data.forEach((item:any) => {
        if (!item.patientId) return;

        const docRef = admin.firestore().doc(`patients/${item.patientId}`);
        writeBatch.set(docRef, item)
    });
    return writeBatch.commit().then(result => {
        console.log(`Committed batch of ${data.length} patients`) 
    }).catch(err => {
        console.log('error saving this batch ', err)
    })
}