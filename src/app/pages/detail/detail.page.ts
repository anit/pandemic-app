import { Component, OnInit } from '@angular/core';
import { DbService } from 'src/app/services/db.service';
import { AuthService } from 'src/app/services/auth.service';
import { GoogleMap, GoogleMaps } from '@ionic-native/google-maps';
import { Observable } from 'rxjs';

declare var google;


class StatsVM {
  name: string;
  dead: number;
  positive: number;
  recovered: number;
  total: number;
  lastUpdated: Date;

  constructor(stateName, serverStatsObj) {
    this.name = stateName;
    this.dead = parseInt(serverStatsObj.dead) || 0;
    this.positive = parseInt(serverStatsObj.positive) || 0;
    this.recovered = parseInt(serverStatsObj.recovered) || 0;
    this.total = this.dead + this.positive + this.recovered;
    this.lastUpdated = new Date(serverStatsObj.lastUpdated)
  }
}

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage {

  public myLoc: any = {};
  public error: any = {};
  stateStats: StatsVM;
  map: GoogleMap;
  expand: false;
  recentPatients: Observable<unknown[]>;
  patientSlideOpts: any = { slidesPerView: 1.2, spaceBetween: 20, centeredSlides: true };

  constructor(private dbService: DbService) { }
  async ionViewDidEnter () {
    this.dbService.getStatsByState(AuthService.CurrentUser.homeLocation.state).subscribe(stats => {
      this.stateStats = new StatsVM(AuthService.CurrentUser.homeLocation.state, stats)
    })

    console.log('fetching patients for city ', AuthService.CurrentUser.homeLocation.district);
    this.recentPatients = this.dbService
      .getPatientsByDistrict(AuthService.CurrentUser.homeLocation.district);
    await this.loadMap()
  }

  loadMap () {
    const currentUser = AuthService.CurrentUser;
    this.map = GoogleMaps.create('detail-map-canvas', {
      camera: {
        target: {
          lat: currentUser.homeLocation.latitude,
          lng: currentUser.homeLocation.longitude
        },
        zoom: 15,
        tilt: 30
      }
    })
  }
}

