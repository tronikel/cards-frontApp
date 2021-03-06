import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import allPokemons from '../../assets/json/pokemons.json';
import { Board } from '../models/board';
import { IPokemon } from '../interfaces/pokemon';
import { Player } from '../models/player';
import { Card } from '../models/card';




@Injectable()
export class GameService {

  public STATUS = {
    WAITING: '0',
    READY: '1',
    STARTED: '2'
  };
  private code: string;
  public codeSubject = new Subject<string>();
  private currentPlayer: Player;
  private mainPlayer: Player;
  public currentPlayerSubject = new Subject<Player>();
  private playersMax = 5; // total number of players (me inside)
  private players: Player[];
  public playersSubject = new Subject<Player[]>();
  private board: Board;
  private pokemons = allPokemons as IPokemon[];
  public boardSubject = new Subject<Board>();
  public pokemonsSubject = new Subject<any>();
  private status = this.STATUS.WAITING;
  private rounds: any[];
  private currentRound: number;
  public roundsSubject = new Subject<any[]>();
  public statusSubject = new Subject<any>();
  public currentRoundSubject = new Subject<number>();
  private notif: any;
  public notifSubject = new Subject<any>();
  private endGame: string;
  public endGameSubject = new Subject<string>();
  private total: number;
  private ligne: number;
  private cpt: number;
  public cptSubject = new Subject<number>();
  public rdPlaySubject = new Subject<any>();
  public cptDecrementer;

  decrementCpt() {
    this.resetCpt();
    console.log("decrement");
    this.cptDecrementer = setInterval(() => {
      if (this.cpt > 0) {
        this.cpt--;
        this.emitCpt();
        console.log(this.cpt);
      } else {
        this.resetCpt();
        this.emitCpt();
        this.emitRdPlay();
        clearInterval(this.cptDecrementer);
        //  this.decrementCpt();
      }
    }, 1000);
  }

  stopCptDecrement() {
    clearInterval(this.cptDecrementer);
  }

  constructor() {
    this.currentPlayer = new Player('inc', 'inconnu', false, 0, 0);
    this.board = (new Board());
    this.currentRound = 0;
    this.endGame = 'NO';
    this.notif = { message: null, style: null };
    this.rounds = new Array<any>();
    for (let index = 0; index < 11; index++) {
      this.rounds[index] = new Array<any>();
    }
  }

  init(code, usertype) {
    this.code = code;
    this.players = new Array<Player>();
    this.status = this.STATUS.WAITING;
    const username = 'inc-' + Math.floor(Math.random() * 1000);
    const id = Math.random();
    const ismaster: boolean = usertype === 'master';
    // console.log(usertype + 'ismaster : ' + (usertype === 'master'));
    this.currentPlayer = new Player(username, 'inconnu', ismaster, 0, id);
    this.players.push(new Player(username, 'inconnu', ismaster, 0, id));
    this.emitCurrentPlayer();
    
    this.emitPlayers();
    this.board = (new Board());
    this.emitBoard();

  }

  updateOnlySender(m) {
    const message = m.content;
    const p = (new Player('', '', false, 0, 0)).create(m.from);
    console.log("in update only sender");
  

    for (let index = 0; index < this.players.length; index++) {
      if (this.players[index].getid() === p.getid()) {
        this.players[index] = (new Player('', '', false, 0, 0)).create(m.from);
      }
    }
    console.log(this.players);

    this.players.forEach(e => {
      if (e.getid() === p.getid()) {
        e = p;
        console.log(e);
      }
    });

    this.rounds = message.rounds;
    this.board = this.board.create(message.board as Board);
    // console.log(this.currentRound);
    // console.log (this.rounds[this.currentRound]);
    if (this.rounds[this.currentRound].length === this.players.length) {
      this.updateCardBoard();
      this.currentRound = this.currentRound++;
      // this.currentPlayer.setHasPlayed(false);
      // this.emitCurrentPlayer();
    }
    this.status = message.status;

    const error = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (error) {
          reject('error'); // pass values
        } else {
          resolve('done'); // pass values
        }
      }, 1000);
    });
  }

  updateAll(m) {
    const message = m.content;

    this.players = new Array<Player>(),
      message.players.forEach((e: Player) => {
        let p = new Player('', '', false, 0, 0);
        p = p.create(e);
        this.players.push(p);
        if (this.currentPlayer.getUsername() === p.getUsername()) {
          this.currentPlayer = (new Player('', '', false, 0, 0)).create(e);
        }
      });


    this.rounds = message.rounds;
    this.board = this.board.create(message.board as Board);
    // console.log(this.currentRound);
    // console.log (this.rounds[this.currentRound]);
    if (this.rounds[this.currentRound].length === this.players.length) {
      this.updateCardBoard();
      this.currentRound = this.currentRound++;
      // this.currentPlayer.setHasPlayed(false);
      // this.emitCurrentPlayer();
    }
    this.status = message.status;

    const error = false;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (error) {
          reject('error'); // pass values
        } else {
          resolve('done'); // pass values
        }
      }, 1000);
    });
  }
  statusIsNotWaiting() {
    return !((this.status === this.STATUS.READY) || (this.status === this.STATUS.STARTED));
  }
  emitCurrentPlayer() {
    this.currentPlayerSubject.next(this.currentPlayer);
   
  }
  emitStatus() {
    this.statusSubject.next(this.status);
  }
  emitCurrentRound() {

    this.currentRoundSubject.next(this.currentRound);
  }
  emitRounds() {
    this.roundsSubject.next(this.rounds);
  }
  emitPlayers() {
    this.playersSubject.next(this.players);
  }
  emitEndGame() {
    this.endGameSubject.next(this.endGame);
  }
  emitRdPlay() {
    this.rdPlaySubject.next();
  }

  getCurrentPlayer() {
    return this.currentPlayer as Player;
  }

  setCurrentPlayer(p: Player) {
    this.currentPlayer = p;
  }
  getMainPlayer() {
    return this.mainPlayer as Player;
  }
  getCpt() {
    return this.cpt;
  }
  setcpt(cpt: number) {
    this.cpt = cpt;
  }
  resetCpt() {
    this.cpt = 120;
    this.stopCptDecrement();
  }
  emitCpt() {
    this.cptSubject.next(this.cpt);
  }
  setPlayers(p: Player[]) {
    this.players = p;
    this.emitPlayers();
  }
  getPlayers() {
    return this.players as Player[];
  }
  getPlayersMax() {
    return this.playersMax as number;
  }

  setMainPlayer(p: Player) {
    this.mainPlayer = p;
  }

  getBoard() {
    return this.board as Board;
  }

  setBoard(b: Board) {
    this.board = b;
  }
  getRounds() {
    return this.rounds as any[];
  }

  setRounds(r: any[]) {
    this.rounds = r;
  }

  getCurrentRound() {
    return this.currentRound as number;
  }

  setCurrentRound(n: number) {
    this.currentRound = n;
  }

  getPokemons() {
    return this.pokemons as IPokemon[];
  }

  setPokemons(b: IPokemon[]) {
    this.pokemons = b;
  }
  emitCode() {
    this.codeSubject.next(this.code);
  }
  emitNotif() {
    this.notifSubject.next(this.notif);
  }
  getCode() {
    return this.code;
  }

  setCode(code: string) {
    this.code = code;
    this.emitCode();
  }
  getStatus() {
    return this.status;
  }

  gameReady() {
    this.status = this.STATUS.READY;
  }

  gameStarted() {
    //  this.dealcards();
    this.status = this.STATUS.STARTED;
  }
  dealcards() {
    if (Array.isArray(this.players)) {
      if (this.players.length > 0) {
        this.players.forEach(player => {
          for (let index = 0; index < 10; index++) {
            player.addcardtohand(this.board.pickRandomCard());
          }
          if (player.getid() === this.currentPlayer.getid()) {
            this.currentPlayer = (new Player('', '', false, 0, 0)).create(player);
          }
        });

      }
    }

  }

  isWaiting(status?) {
    const s = !!status ? status : this.getStatus();
    return s === this.STATUS.WAITING;
  }

  isReady() {
    return this.getStatus() === this.STATUS.READY;
  }

  addPlayer(p: Player) {
    this.players.push(p);
    this.emitPlayers();
  }

  emitBoard() {
    this.boardSubject.next(this.board);
  }

  playCard(username: string, playedCard: number) {
    this.currentPlayer.setHasPlayed(true);

    for (let index = 0; index < this.players.length; index++) {
      if (this.players[index].getUsername() === this.currentPlayer.getUsername()) {
        this.players[index] = new Player(null, null, null, null, null).create(this.currentPlayer);
      }

    }
    this.emitCurrentPlayer();
    const action = { username, playedCard };
    // console.log('current round = ' + this.currentRound);
    this.rounds[this.currentRound].push(action);
    // this.emitBoard();
  }
  sortNumber(a, b) {
    return a.playedCard - b.playedCard;
  }

  updateCardBoard() {
    console.log('update board');

    this.rounds[this.currentRound].sort(this.sortNumber).forEach(element => {
      const v = this.board.getVector();
      this.notif = { message: null, style: null };
      console.log(v);
      if (element.playedCard > v[3].n) {
        if (v[3].c === 4) {
          this.total = 0;
          this.ligne = v[3].l;
          for (let i = 0; i < 6; i++) {
            this.total = this.total + this.board.table[v[3].l][i].getBall();
            console.log(v[3].l + ': +' + this.board.table[v[3].l][i].getBall() + '  =' + this.total);
            this.board.table[v[3].l][i] = new Card(0);
          }
          console.log(this.board.table[v[3].l][0].getBall());
          console.log(element.username + ' reçoit ' + this.total + ' pokeballs');
          this.notif.message = element.username + ' brise la ligne #' + this.ligne + ' et reçoit ' + this.total + ' Pokeballs de plus ';
          this.notif.style = "warning";
          this.emitNotif();
          this.getPlayerByname(element.username).addBalls(this.total);
          this.board.table[v[3].l][0] = new Card(element.playedCard);
          (this.board.table[v[3].l][0]).setColor(this.getPlayerByname(element.username).getPokemon());
        } else {
          this.notif = { message: null, style: null };
          this.emitNotif();
          this.board.table[v[3].l][v[3].c + 1] = new Card(element.playedCard);
          (this.board.table[v[3].l][v[3].c + 1]).setColor(this.getPlayerByname(element.username).getPokemon());
        }
      } else {
        if (element.playedCard > v[2].n) {
          if (v[2].c === 4) {
            this.total = 0;
            this.ligne = v[2].l;
            for (let i = 0; i < 6; i++) {
              this.total = this.total + this.board.table[v[2].l][i].getBall();
              console.log(v[2].l + ': +' + this.board.table[v[2].l][i].getBall() + '  =' + this.total);
              this.board.table[v[2].l][i] = new Card(0);
            }
            console.log(this.board.table[v[3].l][0].getBall());
            console.log(element.username + ' reçoit ' + this.total + ' pokeballs');
            this.notif.message = element.username + ' brise la ligne #' + this.ligne + ' et reçoit ' + this.total + ' Pokeballs de plus ';
            this.notif.style = "warning";
            this.emitNotif();
            this.getPlayerByname(element.username).addBalls(this.total);
            this.board.table[v[2].l][0] = new Card(element.playedCard);
            (this.board.table[v[2].l][0]).setColor(this.getPlayerByname(element.username).getPokemon());
          } else {
            this.notif = { message: null, style: null };
            this.emitNotif();
            this.board.table[v[2].l][v[2].c + 1] = new Card(element.playedCard);
            (this.board.table[v[2].l][v[2].c + 1]).setColor(this.getPlayerByname(element.username).getPokemon());
          }
        } else {
          if (element.playedCard > v[1].n) {
            if (v[1].c === 4) {
              this.total = 0;
              this.ligne = v[1].l;
              for (let i = 0; i < 6; i++) {
                this.total = this.total + this.board.table[v[1].l][i].getBall();
                console.log(v[1].l + ': +' + this.board.table[v[1].l][i].getBall() + '  =' + this.total);
                this.board.table[v[1].l][i] = new Card(0);
              }
              console.log(this.board.table[v[1].l][0].getBall());
              console.log(element.username + ' reçoit ' + this.total + ' pokeballs');
              this.notif.message = element.username + ' brise la ligne #' + this.ligne + ' et reçoit ' + this.total + ' Pokeballs de plus ';
              this.notif.style = 'warning';
              this.emitNotif();
              this.getPlayerByname(element.username).addBalls(this.total);
              this.board.table[v[1].l][0] = new Card(element.playedCard);
              (this.board.table[v[1].l][0]).setColor(this.getPlayerByname(element.username).getPokemon());
            } else {
              this.notif = { message: null, style: null };
              this.emitNotif();
              this.board.table[v[1].l][v[1].c + 1] = new Card(element.playedCard);
              (this.board.table[v[1].l][v[1].c + 1]).setColor(this.getPlayerByname(element.username).getPokemon());
            }
          } else {
            if (element.playedCard > v[0].n) {
              if (v[0].c === 4) {
                this.total = 0;
                this.ligne = v[0].l;

                for (let i = 0; i < 6; i++) {
                  this.total = this.total + this.board.table[v[0].l][i].getBall();
                  console.log(v[0].l + ': +' + this.board.table[v[0].l][i].getBall() + '  =' + this.total);
                  this.board.table[v[0].l][i] = new Card(0);
                }
                console.log(this.board.table[v[1].l][0].getBall());
                console.log(element.username + ' reçoit ' + this.total + ' pokeballs');
                this.notif.message = element.username + ' brise la ligne #' + this.ligne + ' et reçoit ' + this.total + ' Pokeballs de plus ';
                this.notif.style = "warning";
                this.emitNotif();
                this.getPlayerByname(element.username).addBalls(this.total);
                this.board.table[v[0].l][0] = new Card(element.playedCard);
                (this.board.table[v[0].l][0]).setColor(this.getPlayerByname(element.username).getPokemon());
              } else {
                this.notif = { message: null, style: null };
                this.emitNotif();
                this.board.table[v[0].l][v[0].c + 1] = new Card(element.playedCard);
                (this.board.table[v[0].l][v[0].c + 1]).setColor(this.getPlayerByname(element.username).getPokemon());
              }
            } else {
              const temp = { i: 0, t: 10000000000 };
              for (let i = 0; i < 4; i++) {
                let t = 0;
                for (let j = 0; j < 6; j++) {
                  t = t + this.board.table[i][j].getBall();
                  console.log(i + ': +' + this.board.table[i][j].getBall() + '  =' + t);
                }
                if (t < temp.t) {
                  temp.i = i;
                  temp.t = t;
                }

              }
              this.ligne = temp.i;
              this.total = temp.t;
              console.log(element.username + ' reçoit ' + this.total + ' pokeballs');
              this.notif.message = element.username + ' brise la ligne #' + (this.ligne + 1) + ' et reçoit ' + this.total + 'Pokeballs de plus ';
              this.notif.style = "warning";
              this.emitNotif();
              this.getPlayerByname(element.username).addBalls(this.total);
              for (let i = 0; i < 6; i++) {
                this.board.table[this.ligne][i] = new Card(0);
              }
              this.board.table[this.ligne][0] = new Card(element.playedCard);
              (this.board.table[this.ligne][0]).setColor(this.getPlayerByname(element.username).getPokemon());
            }

          }

        }
      }
    });
    this.currentRound = this.currentRound + 1;
    this.players.forEach((e: Player) => {
      e.setHasPlayed(false);
      e.setRank(1);
      this.players.forEach((t: Player) => {
        if (e.getPickedBalls() > t.getPickedBalls()) {
          e.setRank(e.getRank() + 1);
        }

      });
    });
    this.currentPlayer.setHasPlayed(false);
    this.currentPlayer.setRank(this.getPlayerByname(this.currentPlayer.getUsername()).getRank());
    this.currentPlayer.setPickedBalls(this.getPlayerByname(this.currentPlayer.getUsername()).getPickedBalls());
    if (this.currentRound > 9) {

      this.players.forEach((t: Player) => {
        if (t.getRank() === 1) {
          this.endGame = t.getUsername() + ' a remporté la partie avec ' + t.getPickedBalls() + ' collectées <br> Voulez vous quitter et rejouer une autre partie?';

        }

      });

    } else {
      this.decrementCpt();
    }

  }

  getPlayerByname(name: string): Player {
    let temp: Player = new Player('', '', '', 0, 0);
    this.players.forEach(element => {
      // console.log(element.getUsername() + ' - ' + name);
      if (element.getUsername() === name) {
        temp = element;

      }
    });
    // console.log(temp);
    return temp;
  }
}
