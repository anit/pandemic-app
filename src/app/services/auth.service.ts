

import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
import { Observable, observable, Observer } from 'rxjs';
import { NotificationService } from './notification.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser: any
  constructor(private af: AngularFireAuth) {}

  createUser(): Promise<any> {
    return this.af.auth.setPersistence(auth.Auth.Persistence.LOCAL).then(() => {
      return this.af.auth.signInAnonymously();
    }) 
  }

  public onUserLogin(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.af.auth.onAuthStateChanged(user => {
        if (user) {
          this.currentUser = user
        }
        return this.currentUser
      })
    })
  }
}
