

import { Injectable } from '@angular/core';
import { FirebaseAuthentication } from '@ionic-native/firebase-authentication/ngx';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private firebaseAuth: FirebaseAuthentication) {}

  createUser(): Promise<any> {
    return this.firebaseAuth.signInAnonymously()
  }
}
