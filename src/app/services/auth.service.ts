

import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _currentUser: any
  constructor(private firebaseAuth: FirebaseAuthentication) {}

  createUser(): Promise<any> {
    return this.firebaseAuth.signInAnonymously().then((res) => {
      this._currentUser = res
    }) 
  }

  onUserLogin(): Observable<any> {
    var observable = this.firebaseAuth.onAuthStateChanged()
    observable.subscribe(user => {
      if (user) this._currentUser = user;
    })
    return observable;
  }
}
