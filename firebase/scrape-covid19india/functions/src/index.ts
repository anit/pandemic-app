import * as functions from 'firebase-functions';
import fetch from 'node-fetch';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


export const scheduledEnglishTimer = functions.pubsub.schedule('every 10 minutes').onRun(() => {
    fetch('https://api.rootnet.in/covid19-in/unofficial/covid19india.org')
        .then((res:any) => res.json())
        .then((doc:any) => console.log(doc))
})