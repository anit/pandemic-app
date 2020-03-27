import { Component, ViewChild } from '@angular/core';
import {AuthService} from '../../services/auth.service';
import { TranslateConfigService } from '../../translate-config.service';
import { Router } from '@angular/router';
import { IonSlides } from '@ionic/angular';


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
    tags: [],
    symptoms: []
  };
  public ageGroups: Array<Object> = [
    { label: 'Under 12yrs Old',   value: 0, icon: 'kid.svg' },
    { label: '13 to 19 yrs Old',  value: 1, icon: 'teen.svg' },
    { label: '20 to 45 yrs Old',  value: 2, icon: 'young.svg' },
    { label: '45 to 69 yrs Old',  value: 3, icon: 'senior.svg' },
    { label: '70yrs and above',   value: 4, icon: 'old.svg' }
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
    private router: Router) { }

  fireAuth() {
    this.netBusy = true
    this.authService.createUser().then(() => {
      this.router.navigateByUrl('/detail')
    }).finally(() => this.netBusy = false);
  }
}
