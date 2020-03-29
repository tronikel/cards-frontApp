import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GameService } from './services/game.service';
declare var UIkit: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cards-frontApp';
  constructor(

    private gameService: GameService,

    private router: Router,
  ) { }
  gotoHome() {
    if ( this.gameService.statusIsNotWaiting()) {
      this.router.navigate(['../home']);
    } else {
      UIkit.modal.confirm('Voulez-vous Vraiment quitter cette parti?').then((e) => {
        this.router.navigate(['../home']);
    }, (e) => {
        console.log('Rejected.');
    });
    }
  }
}

