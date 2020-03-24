import { Component, OnInit, Input } from '@angular/core';

import { GameService } from '../services/game.service';
import { ChatService } from '../services/chat.service';
import * as $ from 'jquery';
declare var UIkit: any;

@Component({
  selector: 'app-my-hand',
  templateUrl: './my-hand.component.html',
  styleUrls: ['./my-hand.component.css']
})
export class MyHandComponent implements OnInit {
  @Input("myHand") cards: number[];
  @Input("username") playerUsername: string;
  @Input("hasPlayed") playerhasPlayed: boolean;

  constructor(private gameService: GameService, private chatService: ChatService) { }

  ngOnInit() {
  }
  highlightCard(highlightCard) {
    const element = '#card' + highlightCard + ' div';
    $('#myHand div.pokecard').removeClass('selectedCard');
    $(element).addClass('selectedCard');

    console.log('hightlighted  : ' + element);
  }
  playCard(playedCard) {
    if (!this.playerhasPlayed) {
    this.cards.splice(this.cards.indexOf(playedCard), 1);
    this.gameService.playCard(this.playerUsername, playedCard);
    const message = {
      players : this.gameService.getPlayers(),
      rounds : this.gameService.getRounds(),
      board : this.gameService.getBoard(),
      status : this.gameService.getStatus(),
      currentRound : this.gameService.getCurrentRound(),
      };
    this.chatService.sendGame(message);
    } else {
      UIkit.notification('<i class="uk-icon-close"></i> Veuillez attendre que les autres joueurs jouent ', { status: 'danger' });
    }
  }
  setid(n: number) {
    return 'card' + n;
  }
}
