import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private dbStoreService: AngularFirestore, private afAuth: AngularFireAuth, private firebaseAuth: FirebaseAuthentication) {
    this.firebaseAuth
      .onAuthStateChanged()
      .subscribe(user => {
        user && this.firebaseAuth.getIdToken(false).then(token => {
          this.afAuth.auth.signInWithCustomToken(token)
        })
      })
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
}
