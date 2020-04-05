import { Component, OnInit } from '@angular/core';
import { LocationService } from 'src/app/services/location.service';

declare var google;

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  public myLoc: any = {};
  public error: any = {};

  constructor(private locationService: LocationService) { }
  ngOnInit(): void { }

  showChart() {
    var data = google.visualization.arrayToDataTable([
      ['Country', 'Popularity'],
      ['Germany', 200],
      ['United States', 300],
      ['Brazil', 400],
      ['Canada', 500],
      ['France', 600],
      ['RU', 700]
    ]);

    var options = {};

    var chart = new google.visualization.GeoChart(document.getElementById('regions_div'));

    chart.draw(data, options);
  }
}

