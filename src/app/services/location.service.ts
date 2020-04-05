import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';

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
    private nativeGeocoder: NativeGeocoder) { }

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
}
