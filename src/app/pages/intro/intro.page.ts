import { Component, OnInit, ViewChild } from '@angular/core';
import { IonSlides } from '@ionic/angular';
import { TranslateConfigService } from '../../translate-config.service';

@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {

  @ViewChild(IonSlides, {static: false}) slides: IonSlides;
  

  public animations: Object;
  public slideOptions: Object;

  constructor(private translateConfigService: TranslateConfigService) {

    this.animations = {
      welcome: 'assets/lottie/welcome.gif',
      privacy: 'assets/lottie/privacy.gif',
      people: 'assets/lottie/people.gif',
    };

    this.slideOptions = {
      type: 'progressbar'
    }
  }

  ngOnInit(): void {}
  ionViewDidLoad() {}
  async slideChanged() {}

  goToSlide(slide) {
    this.slides.slideTo(slide, 700, true);
  }
}
