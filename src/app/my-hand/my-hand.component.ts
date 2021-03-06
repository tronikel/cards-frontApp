import { Component, OnInit, Input } from '@angular/core';

import { GameService } from '../services/game.service';
import { ChatService } from '../services/chat.service';
import { Subscription, from } from 'rxjs';
import { Card } from '../models/card';
import * as $ from 'jquery';
declare var UIkit: any;

@Component({
  selector: 'app-my-hand',
  templateUrl: './my-hand.component.html',
  styleUrls: ['./my-hand.component.css']
})
export class MyHandComponent implements OnInit {
  @Input("myHand") cds: number[];
  @Input("pokemon") playerpokemon: string;
  @Input("username") playerUsername: string;
  @Input("hasPlayed") playerhasPlayed: boolean;
  cards: Card[];
  rdPlaySubcription: Subscription;
  constructor(private gameService: GameService, private chatService: ChatService) { }

  ngOnInit() {
    this.cards = [];
    this.cds.forEach(e => {
      this.cards.push(new Card(e));
    });

    this.rdPlaySubcription = this.gameService.rdPlaySubject.subscribe(
      (e) => {

        this.playRandomCard();

        //this.currentPlayer = currentPlayer;
        // console.log("board : current player Update");
      }
    );
  }
  highlightCard(highlightCard) {
    const element = '#card' + highlightCard + '>div';
    $('#myHand div.pokecard').removeClass('selectedCard');
    $(element).addClass('selectedCard');

    console.log('hightlighted  : ' + element);
  }
  playRandomCard() {
    if (!this.playerhasPlayed) {
      const r = Math.floor(Math.random() * this.cards.length);

      this.gameService.playCard(this.playerUsername, this.cards[r].getNumber());
       // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.cards.length; index++) {
        if (this.cards[index].getStatus() === 'last') {
          this.cards[index].setStatus('old');
        }
      }

      this.cards[r].setStatus('last');
      const message = {
        players: this.gameService.getPlayers(),
        rounds: this.gameService.getRounds(),
        board: this.gameService.getBoard(),
        status: this.gameService.getStatus(),
        currentRound: this.gameService.getCurrentRound(),
      };
      this.chatService.sendGame(message);
    }

  }
  playCard(playedCard) {
    if (!this.playerhasPlayed) {
      // tslint:disable-next-line: prefer-for-of
      for (let index = 0; index < this.cards.length; index++) {
        if (this.cards[index].getStatus() === 'last') {
          this.cards[index].setStatus('old');
        }
      }
      this.cards.forEach(e => {
        if (e.getNumber() === playedCard) {
            e.setStatus('last');
        }
      });
      this.gameService.playCard(this.playerUsername, playedCard);
      const message = {
        players: this.gameService.getPlayers(),
        rounds: this.gameService.getRounds(),
        board: this.gameService.getBoard(),
        status: this.gameService.getStatus(),
        currentRound: this.gameService.getCurrentRound(),
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
