import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
declare var UIkit: any;

import { GameService } from '../services/game.service';
import { ChatService } from '../services/chat.service';
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
export class WaitingPlayersComponent implements OnInit {

  code: string;
  selectedpseudo: string;
  seletedpokemon: string;
  currentPlayer: Player;
  public employees = [];
  public errorMsg;


  codeSubscription: Subscription;
  players: Player[];
  playersSubscription: Subscription;

  waiting: number;
  selectPseudoForm: FormGroup;

  pokemonsList: IPokemon[];



  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private chatService: ChatService) { }


  ngOnInit() {
    this.route.queryParams.subscribe((params: ParamMap) => {
      let id = null;
      console.log(params);
      id = params['code'];
      let userType = null;
      userType = params['userType'];
      this.code = id;
      this.currentPlayer = new Player('', '', userType === 'master');
      this.pokemonsList = allPokemons as IPokemon[];
      this.initselectPseudoForm();
      this.gameService.init(id, userType);
      console.log(this.gameService.getCurrentPlayer());
      this.chatService.initSocket();
      this.chatService.getNewsubConnections().subscribe((message) => {
        console.log(message);
        this.updatePlayers(message['content']);
      });
      this.chatService.getPlayersUpdated().subscribe((message) => {
        console.log('players update received');
        console.log(message);
        this.updatePlayers(message['content']);
      });
      this.chatService.observePartyStart().subscribe((message) => {
        this.updatePlayers(message['content']);
      });
      this.chatService.observePartyStart().subscribe((message) => {
        console.log('Start party');
        if (this.gameService.isReady) {
          this.gameService.updateAll(message['content']).then(
            (val) => {
              console.log(' start party : content updated');
              this.router.navigate(['../board'], { queryParams: { code: this.code } });
              UIkit.notification("<i class='uk-icon-close'></i> La partie est lancée", { status: 'success' });
            },
            (err) => console.error(err)
          );

        } else {
          UIkit.notification("<i class='uk-icon-close'></i> Trop tard! La partie commencera sans vous", { status: 'danger' });
          this.router.navigate(['../home']);
        }
      });

    });
    this.playersSubscription = this.gameService.playersSubject.subscribe(
      (players: Player[]) => {
        this.players = players;
        console.log("WaitingPlayers : players Update");
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
  ismaster(): boolean {
    let result = false;
    if (this.gameService.getCurrentPlayer().getIsMainUser()) {
      result = this.gameService.getCurrentPlayer().getIsMainUser();
    }
    return result;
  }


  sendPokemonChoice(event, i, name) {
    this.currentPlayer.setPokemon(name);
    const temp = this.gameService.getCurrentPlayer().getUsername();
    this.gameService.getCurrentPlayer().setPokemon(name);
    this.gameService.getPlayerByname(temp).setUsername(name);
    this.gameService.emitPlayers();
    this.gameService.gameReady();
    this.gameService.emitCurrentPlayer();
    this.chatService.addNewPlayer();
  }

  UpdateCurrentUserName(pseudo) {
    this.currentPlayer.setUsername(pseudo);
    const temp = this.gameService.getCurrentPlayer().getUsername();
    this.gameService.getCurrentPlayer().setUsername(pseudo);
    this.gameService.getPlayerByname(temp).setUsername(pseudo);
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

  startParty() {
    console.log(this.gameService.getPlayers());
    this.gameService.gameStarted();
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

      newPlayers.push(new Player(e.username, e.pokemon, e.isMainUser));

    });

    this.gameService.setPlayers(newPlayers);
    console.log(this.gameService.getPlayers());
    console.log("players listed");
    $('#connectedUsers').empty();
    this.players = [];
    this.gameService.getPlayers().forEach((e) => {
      ///  console.log(e.getPokemon());
      this.players.push(e);
      this.pokemonsList.forEach((b) => {
        if (e.getPokemon() === b.name) {
            b.selected = true;
            b.master = e.getUsername();
        }
      });

      /*$('#connectedUsers').append('<li> <div class="uk-grid-small uk-flex-middle" uk-grid> '
        + '<div class="uk-width-auto"> <img class="uk-align-center uk-align-middle@m  uk-border-circle"  src="'
        + '../../assets/image/pokemon/' + this.getPokemonImage(e.getPokemon())
        + '.svg" width="40" height="40" alt="Example image"> </div>'
        + '<div class="uk-width-expand uk-text-left "><span class="uk-label uk-label-primary">'
        + e.getUsername() + '</span></div> ' + this.getmasterlabel(e.getIsMainUser()) + '</div></li>');
      $('#pokemons div.' + e.getPokemon()).removeClass('available');
      $('#pokemons div.' + e.getPokemon()).addClass('unavailable');
      $('#pokemons div.' + e.getPokemon() + ' small.help')
        .html('<small class="help uk-text-bold"> Selectionné par ' + e.getUsername() + '</small></p>');*/
    });
  }
}
