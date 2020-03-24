import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';

import { ChatService } from '../services/chat.service';
import { GameService } from '../services/game.service';
import { Player } from '../models/player';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  message: string;
  messages: any[] = [];

  constructor(
    private chatService: ChatService,
    private gameService: GameService) { }

  ngOnInit() {
    const $chatbox = $('.chatbox');
    const $chatboxTitle = $('.chatbox__title');
      /*,
        $chatboxTitleClose = $('.chatbox__title__close'),
        $chatboxCredentials = $('.chatbox__credentials')*/;
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

    this.chatService.getMessages().subscribe(
      (message: any) => {
        this.messages.push(message);
      });
  }

  sendMessage() {
    this.chatService.sendMessage(this.message);
    this.message = '';
  }

  isMine(from: Player) {
    return this.gameService.getCurrentPlayer() === from;
  }

}
