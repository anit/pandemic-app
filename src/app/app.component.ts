import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private router: Router,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translate: TranslateService,
    private globalization: Globalization,
    private mobileAccessibility: MobileAccessibility,
    private authService: AuthService
  ) {
    this.initializeApp();
    this.translate.setDefaultLang('en');
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.mobileAccessibility.usePreferredTextZoom(false);
      this.authService.onUserLogin().subscribe(user => {
        if (user) {
          this.router.navigateByUrl('/detail');
        } else {
          this.router.navigateByUrl('/intro');
        }
      })
    });

    this.globalization.getPreferredLanguage().then(res => {
      this.translate.use(res.value);
      console.log("Setting language to ", res)
    })
  }
}
