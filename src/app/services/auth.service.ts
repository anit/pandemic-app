

import { Injectable } from '@angular/core';
import { Plugins } from '@capacitor/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, Observer } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AppLocation, FallbackLocation } from './location.service';

const { Storage } = Plugins;

export class AppUser {
  uid: string = '';
  homeLocation: AppLocation = FallbackLocation;
  otherLocations: Array<AppLocation> = [];
  tags: Array<string> = []
  notificationToken: string = '';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currenetUserObservable: Observable<any>;

  static CurrentUser: AppUser = new AppUser();

  constructor(private af: AngularFireAuth, private afStore: AngularFirestore) {
    Storage.get({ key: 'CurrentUser' }).then(doc => {
      try {
        AuthService.CurrentUser = JSON.parse(doc.value) || new AppUser()
        if (AuthService.CurrentUser.uid) this.createUserObserver
      } catch { }
    })
  }

  createUser(): Promise<any> {
    return this.af.auth.setPersistence(auth.Auth.Persistence.LOCAL).then(() => {
      return this.af.auth.signInAnonymously();
    }) 
  }

  public createUserObserver () {
    this.afStore.doc<any>(`users/${AuthService.CurrentUser.uid}`)
      .valueChanges()
      .subscribe(user => {
        var currentUser = AuthService.CurrentUser;
        currentUser.homeLocation = user.homeLocation;
        currentUser.otherLocations = user.otherLocations;
        currentUser.tags = user.tags;
        currentUser.notificationToken = user.notificationToken;
      });
  }

  public onUserLogin(): Observable<any> {
    return Observable.create((observer: Observer<any>) => {
      this.af.auth.onAuthStateChanged(user => {
        AuthService.CurrentUser.uid = user.uid
        this.createUserObserver()
      })
    })
  }
}
