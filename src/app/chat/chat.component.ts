import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { ChatService } from '../services/chat.service';
import { GameService } from '../services/game.service';
import { Player } from '../models/player';
import { Subscription } from 'rxjs';
import allPokemons from '../../assets/json/pokemons.json';
import { IPokemon } from '../interfaces/pokemon';
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string;
  messages: any[] = [];
  messageSubscription: Subscription;
  pokemonsList: IPokemon[];

  constructor(
    private chatService: ChatService,
    private gameService: GameService) { }

  ngOnInit() {
    const $chatbox = $('.chatbox');
    this.pokemonsList = allPokemons as IPokemon[];
    const $chatboxTitle = $('.chatbox__title');
      /*,
        $chatboxTitleClose = $('.chatbox__title__close'),
        $chatboxCredentials = $('.chatbox__credentials');*/
    $chatboxTitle.on('click', (e) => {
      e.stopPropagation();
      $chatbox.toggleClass('chatbox--tray');
    });
    /*$chatboxTitleClose.on('click', function(e) {
      e.stopPropagation();
      $chatbox.addClass('chatbox--closed');
    });
    $chatbox.on('transitionend', function() {
      if ($chatbox.hasClass('chatbox--closed')) {
        $chatbox.remove();
      }
      $chatbox.removeClass('chatbox--empty');
    });
    $chatboxCredentials.on('submit', function(e) {
      e.preventDefault();
      $chatbox.removeClass('chatbox--empty');
    });*/

    this.chatService.initSocket();

    this.messageSubscription = this.chatService.observeNewMessage().subscribe(
      (message: any) => {
        this.messages.push(message);
        //console.log ( message.content );
      });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  isMine(from) {
    console.log(from.username);
    return this.gameService.getCurrentPlayer().getUsername() === from.username;
  }


  getPokemonImage(from) {
    let result = null;
    this.pokemonsList.forEach(e => {
      if (e.name === from.pokemon) {
        result = e.image;
      }
    });
    return '../../assets/image/pokemon/' + result + '.svg';
  }
}
