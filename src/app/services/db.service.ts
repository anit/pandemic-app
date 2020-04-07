import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from '@angular/fire/auth';
import { GeoCollectionReference, GeoFirestore, GeoDocumentReference } from 'geofirestore';
import {firestore} from 'firebase'

@Injectable({
  providedIn: 'root'
})
export class DbService {
  private geoFireStore: GeoFirestore;

  constructor(private dbStoreService: AngularFirestore, private afAuth: AngularFireAuth, private firebaseAuth: FirebaseAuthentication) {
    this.geoFireStore = new GeoFirestore(this.dbStoreService.firestore);
    this.firebaseAuth
      .onAuthStateChanged()
      .subscribe(user => {
        user && this.firebaseAuth.getIdToken(false).then(token => {
          this.afAuth.auth.signInWithCustomToken(token)
        })
      })
  }

  getPatientsByDistrict(district) {
    return this.dbStoreService.collection('patients', ref => ref.where('district', '==', district)).valueChanges();
  }

  getStatsByState(state: string) {
    return this.getStats({ attr: 'state', val: state })
  }

  getStatsByCity(city: string) {
    return this.getStats({ attr: 'district', val: city })
  }

  getStats(query: any) {
    return this.dbStoreService.doc(`${query.attr}Stats/${query.val}`).valueChanges();
  }

  addDoc(coll, data) {
    return this.dbStoreService.collection(coll).add(data)
  }

  updateDoc (coll, doc, data) {
    // create document if it doesnt exist.
    return Promise.all([
      this.dbStoreService.doc(`${coll}/${doc}`).set({}, { merge: true }),
      this.dbStoreService.doc(`${coll}/${doc}`).set(data, { merge: true })
    ])
  }

  updateUserFootprint(latidude, longitude, uid) {
    const geoDoc: GeoDocumentReference = this.geoFireStore.collection(`footprint`).doc(`${uid}`);
    return Promise.all([
      geoDoc.set({ coordinates: new firestore.GeoPoint(latidude, longitude) }, { merge: true })
    ])
  }
}
