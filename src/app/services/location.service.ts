import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse, BackgroundGeolocationOriginal, BackgroundGeolocationLocationProvider } from '@ionic-native/background-geolocation';
import { DbService } from './db.service';
import { AuthService } from './auth.service';

export class AppLocation {
  public latitude: string;
  public longitude: string;
  public postalCode: string;
  public state: string;
  public city: string;

  constructor () {}
}

export const FallbackLocation: AppLocation = { 
  latitude: '28.6151947',
  longitude: '77.2059342',
  postalCode: '110004',
  state: 'Delhi',
  city: 'New Delhi'
}

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
        const { latitude, longitude, administrativeArea, subAdministrativeArea, postalCode } = result[0];
        return {
          latitude,
          longitude,
          postalCode,
          state: administrativeArea,
          city: subAdministrativeArea
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
        return this.dbService.updateDoc(`users`, AuthService.CurrentUser.uid, {
          coords: {
            latitude: location.latitude,
            longitude: location.longitude
          }
        })
        .then(_ => {
          BackgroundGeolocation.endTask(taskKey);
        })
      })
    })

    BackgroundGeolocation.start()
  }
}
