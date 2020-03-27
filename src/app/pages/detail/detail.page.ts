import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public myLoc: any = {};
  public error: any = {};

  constructor(private locationService: LocationService) { }

  ngOnInit() {
    this.locationService.setCurrentCity().then((resp) => {
      this.myLoc = this.locationService.currentLocation || resp || {};
      this.error = this.error;
    })
  }

}
