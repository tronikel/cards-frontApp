import { Component, OnInit, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
declare var UIkit: any;

import { GameService } from '../services/game.service';
import { ChatService } from '../services/chat.service';
import { UsernameService } from '../services/username.service';
import allPokemons from '../../assets/json/pokemons.json';
import { IPokemon } from '../interfaces/pokemon';
import { Player } from '../models/player';
import { Board } from '../models/board';

import { templateJitUrl } from '@angular/compiler';

@Component({
  selector: 'app-waiting-players',
  templateUrl: './waiting-players.component.html',
  styleUrls: ['./waiting-players.component.css'],
})
export class WaitingPlayersComponent implements OnInit, AfterViewInit {

  code: string;
  selectedpseudo: string;
  seletedpokemon: string;
  currentPlayer: Player;
  public employees = [];
  public errorMsg;


  codeSubscription: Subscription;
  players: Player[];
  playersSubscription: Subscription;
  currentPlayerSubscription: Subscription;

  waiting: number;
  selectPseudoForm: FormGroup;

  pokemonsList: IPokemon[];
  usernameUnavailable: boolean;



  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private myusernameService: UsernameService,
    private router: Router,
    private chatService: ChatService) {
    this.usernameUnavailable = false;
  }


  ngOnInit() {

    this.currentPlayerSubscription = this.gameService.currentPlayerSubject.subscribe(
      (player: Player) => {
        this.currentPlayer = new Player(null, null, null, null, null).create(player);
        console.log("WaitingPlayers : current player " + this.currentPlayer.getUsername());
      });

    this.playersSubscription = this.gameService.playersSubject.subscribe(
      (players: Player[]) => {
        this.players = players;
        console.log("WaitingPlayers : players Update");
      });
    this.route.queryParams.subscribe((params: ParamMap) => {
      let id = null;
      console.log(params);
      id = params['code'];
      let userType = null;
      userType = params['userType'];
      this.code = id;
      this.currentPlayer = new Player('', '', userType === 'master', 0, 0);
      this.pokemonsList = allPokemons as IPokemon[];
      this.initselectPseudoForm();
      this.gameService.init(id, userType);
      this.chatService.initSocket();
      this.chatService.getNewsubConnections().subscribe((message) => {
        if (!(typeof message['content'] === 'undefined')) {
          this.updatePlayers(message['content']);
        }
      });
      this.chatService.getPlayersUpdated().subscribe((message) => {
        if (!(typeof message['content'] === 'undefined')) {
          console.log(message['content']);
          if (Array.isArray(message['content'])) {
            if (this.currentPlayer.getPokemon() === 'inconnu') {

              this.updatePlayers(message['content']);
              if (message['to'].id === this.currentPlayer.getid()) {

                this.usernameUnavailable = false;
                UIkit.switcher("#wbul").show(1);
              }

            } else {
              //  UIkit.notification("<i class='uk-icon-close'></i> Profil mis à jour ", { status: 'success' });
              console.log(message['to'].id + " vs " + this.currentPlayer.getid());
              if (message['to'].id === this.currentPlayer.getid()) {
                if ((this.currentPlayer.getUsername().split('-')[0] !== 'inc') && (this.currentPlayer.getPokemon() !== 'inconnu')) {
                  $('#wbul li a').removeClass("disablea");
                }
                this.usernameUnavailable = false;
                UIkit.switcher("#wbul").show(2);
              }

              this.updatePlayers(message['content']);
            }

          } else {
            if (message['content'].split('-')[0] === 'KO ') {
              //  UIkit.notification("<i class='uk-icon-close'></i> Le speudo : " + message['content'].split('-')[1] + " est indisponible. Veuillez en choisir un autre ", { status: 'danger' });


              if (message['to'].id === this.currentPlayer.getid()) {
                this.usernameUnavailable = true;
                console.log(this.gameService.getCurrentPlayer().getUsername());
                this.currentPlayer.setUsername(this.gameService.getCurrentPlayer().getUsername());
                console.log("ko");
                console.log(this.currentPlayer.getUsername());

              }
            } else {
              if (message['content'].split('-')[0] === 'OK ') {


                //    UIkit.notification("<i class='uk-icon-close'></i> Speudo : " + message['content'].split('-')[1] + " mis à jour. Veuillez en choisir un pokemon: ", { status: 'success' });
                if (message['to'].id === this.currentPlayer.getid()) {
                  this.usernameUnavailable = false;
                  console.log("ok");
                  console.log(message['to'].username + " vs " + this.currentPlayer.getUsername());
                  this.gameService.getCurrentPlayer().setUsername(this.currentPlayer.getUsername());
                  console.log(this.gameService.getCurrentPlayer().getUsername());
                  UIkit.switcher("#wbul").show(1);
                }
              }

            }

          }
        }
      });

      this.chatService.observePartyStart().subscribe((message) => {
        console.log('Start party');
        if (!(typeof message['content'] === 'undefined')) {

          if (this.gameService.isReady) {
            this.gameService.updateAll(message['content']).then(
              (val) => {
                console.log(' start party : content updated');
                console.log(this.gameService.getCurrentPlayer().getHand());
                this.router.navigate(['../board'], { queryParams: { code: this.code } });
                UIkit.notification("<i class='uk-icon-close'></i> La partie est lancée", { status: 'success' });
              },
              (err) => console.error(err)
            );

          } else {
            UIkit.notification("<i class='uk-icon-close'></i> Trop tard! La partie a commencé sans vous!", { status: 'danger' });
            this.router.navigate(['../home']);
          }
        }
      });

    });


  }

  ngAfterViewInit() {
    $('#usernameinput').change(() => {
      this.usernameUnavailable = false;
    });

  }

  initselectPseudoForm() {
    this.selectPseudoForm = this.formBuilder.group({
      pseudo: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  getPokemonImage(name) {
    let result = null;
    this.pokemonsList.forEach(e => {
      if (e.name === name) {
        result = e.image;
      }
    });
    return '../../assets/image/pokemon/' + result + '.svg';
  }

  selectPokemon(event, i, name) {
    console.log(i);
    console.log(name);

    if ($('#pokemons').children().eq(i).hasClass('available')) {
      $('#pokemons').children().removeClass('selected');
      $('#pokemons div.available span.uk-badge').addClass('is-hidden');
      $('#pokemons').children().eq(i).addClass('selected');
      $('#pokemons').children().eq(i).find('span.uk-badge').removeClass('is-hidden');

    }
  }
  removeselectiontbtn(i) {
    if ($('#pokemons').children().eq(i).hasClass('available')) {
    $('#pokemons').children().eq(i).removeClass('selected');
    $('#pokemons').children().eq(i).find('span.uk-badge').addClass('is-hidden');
    }

  }
  ismaster(): boolean {
    let result = false;
    if (this.gameService.getCurrentPlayer().getIsMainUser()) {
      result = this.gameService.getCurrentPlayer().getIsMainUser();
    }
    return result;
  }


  sendPokemonChoice(event, i, name) {
    this.currentPlayer.setPokemon(name);
    const temp = (new Player(null, null, null, null, null)).create(this.gameService.getCurrentPlayer());
    temp.setPokemon(name);
    // this.gameService.getCurrentPlayer().setPokemon(name);
    // this.gameService.getPlayerByname(temp).setUsername(name);
    //  this.gameService.emitPlayers();
    this.gameService.gameReady();
    // this.gameService.emitCurrentPlayer();
    this.chatService.addNewPlayer(temp);
  }
  sendPokemonAndUsernmaneChoice(pokemon, username) {
    //  this.currentPlayer  = (new Player(null, null, null, null, null)).create(this.gameService.getCurrentPlayer());
    if (username != null) {
      this.currentPlayer.setUsername(username);
      console.log("WaitingPlayers : gameservice current player " + this.gameService.getCurrentPlayer().getUsername());
    }
    if (pokemon != null) {
      this.currentPlayer.setPokemon(pokemon);
    }
    // this.gameService.emitPlayers();
    // this.gameService.gameReady();
    // this.gameService.emitCurrentPlayer();
    console.log("currentPlayer");
    console.log(this.currentPlayer);
    this.chatService.addNewPlayer(this.currentPlayer);
  }

  get pseudo() {
    return this.selectPseudoForm.get('pseudo');
  }
  get pokemon() {
    return this.selectPseudoForm.get('pokemon');
  }
  get pokemons() {
    return this.pokemonsList;
  }

  getmasterlabel(test: boolean) {
    let result = '';
    if (test) {
      result = '<span class="uk-text-right"  uk-icon="star"></span>';
    }
    return result;
  }

  outFunc() {
    const codeBtn = document.getElementById('code');
    codeBtn.setAttribute('uk-tooltip', 'Copier le code');
  }

  copierCode() {
    if (window.getSelection) {
      if (window.getSelection().empty) { // Chrome
        window.getSelection().empty();
        const range = document.createRange();
        range.selectNode(document.getElementById('select_txt'));
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().empty();
        console.log("chrome");
        UIkit.notification("<i class='uk-icon-close'></i> Le code :  " + this.code + " a été copié dans le presse-papier", { status: 'success' });
      } else if (window.getSelection().removeAllRanges) { // Firefox
        window.getSelection().removeAllRanges();
        const range = document.createRange();
        range.selectNode(document.getElementById('select_txt'));
        window.getSelection().addRange(range);
        document.execCommand("copy");
        window.getSelection().removeAllRanges();
        console.log("chrome");
      }
    }
  }

  startParty() {
    console.log(this.gameService.getPlayers());
    this.gameService.gameStarted();
    this.gameService.dealcards();
    const message = {
      players: this.gameService.getPlayers(),
      rounds: this.gameService.getRounds(),
      board: this.gameService.getBoard(),
      status: this.gameService.getStatus(),
      currentRound: this.gameService.getCurrentRound(),
    };
    this.chatService.startParty(message);
    this.router.navigate(['../board'], { queryParams: { code: this.code } });
  }

  updatePlayers(message) {

    const newPlayers: Player[] = [];

    message.forEach((e) => {
      newPlayers.push(new Player(e.username, e.pokemon, e.isMainUser, e.cpt, e.id));
    });

    this.gameService.setPlayers(newPlayers);
    console.log(this.gameService.getPlayers());
    console.log("players listed");
    $('#connectedUsers').empty();
    this.players = [];
    this.pokemonsList.forEach((b) => {
      {
        b.selected = false;
        b.master = "inconnu";
      }
    });

    this.gameService.getPlayers().forEach((e) => {
      //  console.log(e.getPokemon());
      this.players.push(e);
      this.pokemonsList.forEach((b) => {
        if (e.getPokemon() === b.name) {
          b.selected = true;
          b.master = e.getUsername();
        }
      });
    });

  }


}
