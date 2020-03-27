import { Injectable } from '@angular/core';
import { Geolocation, Geoposition } from '@ionic-native/geolocation/ngx';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  public currentLocation: Geoposition;
  public error: any;

  constructor(private geolocation: Geolocation) { }
  public setCurrentCity() {
    return this.geolocation.getCurrentPosition().then((resp) => {
      this.currentLocation = resp;
      console.log('Current location is ', resp, resp.coords)
     }).catch((error) => {
       this.error = error;
       console.log('Error getting location', error);
     });
  }
}
