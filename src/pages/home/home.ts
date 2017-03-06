import { Component, NgZone } from '@angular/core';
import { ModalController, NavController, Platform } from 'ionic-angular';
import { BirthdayService } from '../../services/birthday.service';
import { DetailsPage } from '../details/details';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public birthdays = [];

  constructor(private birthdayService: BirthdayService,
    private nav: NavController,
    private platform: Platform,
    private zone: NgZone,
    private modalCtrl: ModalController) {
    
  }

  ionViewDidLoad() {
    this.platform.ready().then(() => {
      this.birthdayService.initDB();
    })
  }
}
