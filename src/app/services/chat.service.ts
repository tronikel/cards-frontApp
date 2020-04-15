import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

import { GameService } from './game.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //private url = 'http://localhost:3000';
  private url = 'http://18.224.183.130:3000';
  private socket;
  private subSocket;
  private msg = {};

  constructor(private gameService: GameService, ) {
  }

  initSocket() {
    this.socket = io(this.url);
    this.subSocket = io(this.url + '/' + this.gameService.getCode());
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: this.gameService.getCode(),
    };
    this.socket.emit('new-connection', this.msg);
    console.log('new connection emmited');


  }

  getNewsubConnections = () => {
    return new Observable(observer => {
      this.socket.on('New-subconnection', (message) => {
        observer.next(message);
        console.log('subconnect');
      });
    });
  }

  getNewConnections = () => {
    return new Observable(observer => {
      this.socket.on('new-connection-' + this.gameService.getCode(), (message) => {
        if (message.from && this.gameService.getCurrentPlayer() !== message.from) {
          if (this.gameService.isWaiting(message.status)) {
            this.msg['status'] = this.gameService.getStatus();
            this.socket.emit('new-connection', this.msg);
          }
          if (this.gameService.isWaiting()) {
            if (!this.gameService.isWaiting(message.status)) {
              this.gameService.gameStarted();
            }
            observer.next(message);
          }
        }
      });
    });
  }

  sendMessage(message: string) {
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: message
    };
    this.subSocket.emit('new-message', this.msg);
    console.log ('new-message emit :' + message );
  }

  askForUpdatedPlayers() {
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: this.gameService.getCode(),
    };
    this.socket.emit('Ask-ForPlayersUpdate', this.msg);
  }

  getPlayersUpdatedRequest = () => {
    return new Observable(observer => {
      this.socket.on('PlayersUpdateRequest', (message) => {
        observer.next(message);
      });
    });
  }

  /*getMessages = () => {
    return new Observable(observer => {
      this.socket.on('new-message-' + this.gameService.getCode(), (message) => {
        observer.next(message);
      });
    });
  }*/

  addNewPlayer() {
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: this.gameService.getCurrentPlayer()
    };
    this.subSocket.emit('new-player', this.msg);
    console.log('new Player : ' + this.gameService.getCurrentPlayer().getPokemon());
  }

  startParty(code) {
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: code,
    };
    this.subSocket.emit('start-party', this.msg);
    console.log('start party : ' + this.gameService.getCurrentPlayer().getUsername());

  }

  sendGame(message) {
    this.msg = {
      id: this.gameService.getCode(),
      from: this.gameService.getCurrentPlayer(),
      status: this.gameService.getStatus(),
      content: message,
    };
    this.subSocket.emit('update-party', this.msg);
    console.log('update-party : ' + this.gameService.getCurrentPlayer().getUsername());
  }

  observePartyUpdate = () => {
    return new Observable(observer => {
      this.subSocket.on('update-party', (message) => {
        observer.next(message);
      });
    });
  }

  observeNewMessage = () => {
    return new Observable(observer => {
      this.subSocket.on('new-message', (message) => {
        observer.next(message);
      });
    });
  }


  observePartyStart = () => {
    return new Observable(observer => {
      this.subSocket.on('start-party', (message) => {
        observer.next(message);
      });
    });
  }

  getPlayersUpdated = () => {
    return new Observable(observer => {
      this.subSocket.on('update-players', (message) => {
        observer.next(message);
      });
    });
  }
  observePlayerUpdate = () => {
    return new Observable(observer => {
      this.subSocket.on('PlayersUpdateRequest', (message) => {
        if (this.gameService.getCurrentPlayer().getIsMainUser()) {
          observer.next(message);
        }
      });
    });
  }

}
