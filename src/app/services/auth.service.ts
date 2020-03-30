

import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Observable } from 'rxjs';
import { NotificationService } from './notification.service';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: any
  constructor(private firebaseAuth: FirebaseAuthentication) {}

  createUser(): Promise<any> {
    return this.firebaseAuth.signInAnonymously().then((res) => {
      this.currentUser = res
    }) 
  }

  public onUserLogin(): Observable<any> {
    var observable = this.firebaseAuth.onAuthStateChanged()
    observable.subscribe(user => {
      if (user) this.currentUser = user;
      this.firebaseAuth.getIdToken(false).then(token => {
        this.currentUser.token = token
      })
    })
    return observable;
  }
}
