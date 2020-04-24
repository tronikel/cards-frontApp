
import { Router } from '@angular/router';
import { GameService } from './services/game.service';
import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import * as $ from 'jquery';
declare var UIkit: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  title = 'cards-frontApp';
  constructor(

    private gameService: GameService,

    private router: Router,
  ) { }

  ngAfterViewInit() {

    $('#logomodal .modal-background').click(() => {
      $('html').removeClass("is-clipped");
      $('#logomodal').removeClass("is-active");
    });
    $('#logomodal .modal-close').click(() => {
      $('html').removeClass("is-clipped");
      $('#logomodal').removeClass("is-active");
    });
    $('#btn-cancel-lg').click(() => {
      $('html').removeClass("is-clipped");
      $('#logomodal').removeClass("is-active");
    });
    $('#btn-to-home-lg').click(() => {
      console.log("to home");

      this.router.navigate(['../home']);
      this.gameService = new GameService();
      $('html').removeClass("is-clipped");
      $('#logomodal').removeClass("is-active");
    });

  }
  gotoHome() {
    if (this.gameService.statusIsNotWaiting()) {
     // this.router.navigate(['../home']);
    } else {
      $('html').addClass('is-clipped');
      $('#logomodal').addClass('is-active');
    }
  }
}

