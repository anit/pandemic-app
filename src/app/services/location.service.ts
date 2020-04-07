import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse, BackgroundGeolocationOriginal, BackgroundGeolocationLocationProvider } from '@ionic-native/background-geolocation';
import { DbService } from './db.service';
import { AuthService } from './auth.service';
import { AppLocation, FallbackLocation } from '../models/app-location';

@Injectable({
  providedIn: 'root'
})

export class LocationService {
  public currentCoords: Geoposition["coords"];
  public error: any;
  
  geoencoderOptions: NativeGeocoderOptions = {
    useLocale: true,
    maxResults: 5
  };

  constructor(
    private geolocation: Geolocation, 
    private nativeGeocoder: NativeGeocoder,
    private dbService: DbService) { }

  public getCurrentCity(): Promise<AppLocation> {
    return this.geolocation.getCurrentPosition()
      .then(resp => resp.coords)
      .then(coords => this.nativeGeocoder.reverseGeocode(coords.latitude, coords.longitude, this.geoencoderOptions))
      .then(result => {
        const { latitude, longitude, administrativeArea, subAdministrativeArea, locality, postalCode } = result[0];
        return {
          latitude,
          longitude,
          postalCode,
          state: administrativeArea,
          district: subAdministrativeArea,
          city: locality
        };
      })
  }

  public startBackgroundLocation () {
    BackgroundGeolocation.configure({
      locationProvider: BackgroundGeolocationLocationProvider.DISTANCE_FILTER_PROVIDER,
      debug: true,
      interval: 1000
    })

    BackgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe(location => {
      if (!AuthService.CurrentUser.uid) return;
      BackgroundGeolocation.startTask().then(taskKey => {
        return this.dbService
          .updateUserFootprint(location.latitude, location.longitude, AuthService.CurrentUser.uid)
          .finally(() => {
            BackgroundGeolocation.endTask(taskKey);
          })
      })
    })

    BackgroundGeolocation.start()
  }
}
