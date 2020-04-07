import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed, 
  LocalNotifications} from '@capacitor/core';
import { DbService } from './db.service';
import { AngularFireAuth } from '@angular/fire/auth';


const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _token: PushNotificationToken;

  constructor(private dbService: DbService, private af: AngularFireAuth) {
    this.registerListeners()
    this.registerOnLogin()
  }

  registerOnLogin() {
    this.af.auth.onAuthStateChanged((user) => {
      this.updateTokenToDb(user)
    })
  }

  registerListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        this._token = token;
        this.updateTokenToDb(this.af.auth.currentUser)
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError', 
      (error: any) => {
        alert('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationReceived', 
      (notification: PushNotification) => {
        alert('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', 
      (notification: PushNotificationActionPerformed) => {
        alert('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }


  updateTokenToDb(user) {
    user && this._token && this.dbService.updateDoc('users', user.uid, {
      notificationToken: this._token.value
    })
  }

  async checkPermissions () {
    PushNotifications.requestPermissions().then( result => {
      // Register with Apple / Google to receive push via APNS/FCM
      result && PushNotifications.register();
    });

  }
}
