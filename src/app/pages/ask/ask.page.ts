import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../services/auth.service'

@Component({
  selector: 'app-ask',
  templateUrl: './ask.page.html',
  styleUrls: ['./ask.page.scss'],
})
export class AskPage implements OnInit {

  constructor(private authService: AuthService) { }

  ngOnInit() {
  }

  fireAuth() {
    this.authService.createUser()
  }
}
