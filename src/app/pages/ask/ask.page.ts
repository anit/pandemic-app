import { Component, ViewChild } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { TranslateConfigService } from '../../translate-config.service';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';
import { DbService } from '../../services/db.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LocationService, FallbackLocation } from '../../services/location.service';


@Component({
  selector: 'app-ask',
  templateUrl: './ask.page.html',
  styleUrls: ['./ask.page.scss'],
})
export class AskPage {
  @ViewChild(IonSlides, {static: false}) slides: IonSlides;

  public netBusy: boolean = false;

  public formData: Object = { 
    ag: null, 
    tags: {},
    symptoms: {},
    homeLocation: {}
  };
  public ageGroups: Array<Object> = [
    { label: 'Under 12yrs Old',   value: '< 12', icon: 'kid.svg' },
    { label: '13 to 19 yrs Old',  value: '13-19', icon: 'teen.svg' },
    { label: '20 to 45 yrs Old',  value: '20-45', icon: 'young.svg' },
    { label: '45 to 69 yrs Old',  value: '45-69', icon: 'senior.svg' },
    { label: '70yrs and above',   value: '70 <', icon: 'old.svg' }
  ];
  public travelHistory: Array<Object> = [
    { label: 'Foreign Travel', value: 'foreign-travel' },
    { label: 'Met someone with Covid Symptoms', value: 'met-someone-with-symptoms' },
    { label: 'Caretaker to positive patient(s)', value: 'living-with-cp' },
    { label: 'Recovered from Covid19 virus', value: 'recovered' },
  ]

  public symptomsList: Array<Object> = [
    { label: 'Sore Throat', value: 'sore-throat' },
    { label: 'Dry Cough', value: 'dry-cough' },
    { label: 'High Fever', value: 'high-fever' },
    { label: 'Difficulty Breathing', value: 'difficult-breathing' },
    { label: 'Runny nose', value: 'runny-nose' }
  ]

  public preExisting: Array<Object> = [
    { label: 'High BP', value: 'high-bp' },
    { label: 'Diabetes', value: 'diabetic' },
    { label: 'Lung Disease', value: 'lungs-disease' },
    { label: 'Heart Problems', value: 'heart-patient' }
  ]

  constructor(
    private authService: AuthService, 
    private translateConfigService: TranslateConfigService,
    private router: Router,
    private af: AngularFireAuth,
    private dbStoreService: DbService,
    private locationService: LocationService) {
      this.locationService.getCurrentCity()
        .then(location => this.formData['homeLocation'] = location)
        .catch(_ => this.formData['homeLocation'] = FallbackLocation);
    }

    serializeFormData () {
      var fd = this.formData
      var tags = Object.keys(fd['tags']).filter(i => !!fd['tags'][i]);
      fd['ag'] && tags.push(fd['ag']);
      return {
        tags: tags,
        homeLocation: fd['homeLocation']
      }
    }

  fireAuth() {
    if (this.netBusy) return;

    this.netBusy = true
    var unsubscribe = this.af.auth.onAuthStateChanged(user => {
      if (user) {
        this
          .dbStoreService
          .updateDoc('users', user.uid, this.serializeFormData())
          .then(_ => {
            this.netBusy = false;
            this.router.navigateByUrl('/detail')
            this.authService.createUserObserver()
          })
          .catch(err => {
            console.log('Error creating user after ask screen')
            this.af.auth.signOut();
          });
        unsubscribe();
      }
    });
    this.authService.createUser();
  }
}
