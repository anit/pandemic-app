import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { DbService } from './db.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from './auth.service';
import { Location } from '@angular/common';

export class AppLocation {
  public latitude: string;
  public longitude: string;
  public postalCode: string;
  public state: string;
  public city: string;

  constructor () {}
}

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  public currentCoords: Geoposition["coords"];
  public error: any;
  public fallbackLocation: AppLocation = {
    latitude: '28.6151947',
    longitude: '77.2059342',
    postalCode: '110004',
    state: 'Delhi',
    city: 'New Delhi'
  }

  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private geolocation: Geolocation, 
    private nativeGeocoder: NativeGeocoder, 
    private dbService: DbService,
    private authService: AuthService) { }

  public setCurrentCity() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      const coords = resp.coords;

      this.nativeGeocoder.reverseGeocode(coords.latitude, coords.longitude, this.geoencoderOptions)
      .then((result) => {
        const { latitude, longitude, administrativeArea, subAdministrativeArea, postalCode } = result[0];
        this.updateLocation({
          latitude,
          longitude,
          postalCode,
          state: administrativeArea,
          city: subAdministrativeArea
        });
      })
      .catch((error: any) => {
        console.log('Error getting location', error);
        this.updateLocation(null)
      });
     }).catch((error) => {
       console.log('Error getting locaiton', error)
       this.updateLocation(null)
     });
  }

  updateLocation(location:AppLocation) {
    location = location || this.fallbackLocation;
    this.dbService.updateDoc(`users`, this.authService.currentUser.uid, {
      homeLocation: location
    });
  }
  
}
