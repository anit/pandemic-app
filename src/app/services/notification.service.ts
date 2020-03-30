import { Injectable } from '@angular/core';
import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed, 
  LocalNotifications} from '@capacitor/core';
import { DbService } from './db.service';
import { AuthService } from './auth.service';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';


const { PushNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private _token: PushNotificationToken;

  constructor(private dbService: DbService, private authService: AuthService, private firebaseAuth: FirebaseAuthentication) {
    this.registerListeners()
    this.registerOnLogin()
  }

  registerOnLogin() {
    var observable = this.firebaseAuth.onAuthStateChanged()
    observable.subscribe(user => {
      this.updateTokenToDb(user)
    })
  }

  registerListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration', 
      (token: PushNotificationToken) => {
        this._token = token;
        this.updateTokenToDb(this.authService.currentUser)
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
  }


  updateTokenToDb(user) {
    if (user && this._token) {
      this.dbService.updateDoc('users', this.authService.currentUser.uid, {
        notificationToken: this._token
      })
    } else {
      console.log('Not able to set token into db')
    }
  }

  async checkPermissions () {
    PushNotifications.requestPermissions().then( result => {
      console.log('result is ', result )
      if (result) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

  }
}
