import { Component, OnInit, Input } from '@angular/core';
import allPokemons from '../../assets/json/pokemons.json';
import { IPokemon } from '../interfaces/pokemon';
import { Player } from '../models/player';
import { GameService } from '../services/game.service';
import { Subscription } from 'rxjs';
import * as $ from 'jquery';
declare var UIkit: any;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() player: Player;
  @Input() isCurrent: boolean;
  rankPrefixe: string[] = ['-', 'er', 'e', 'e', 'e', 'e', 'e', 'e', 'e', 'e'];
  
  minutes;
  secondes;
  compteur;
  currentPlayerSubject: Subscription;
  cptSubcription: Subscription;
  cptClass ="uk-text-secondary";

  pokemonsList: IPokemon[];

  constructor(private gameService: GameService) {
    this.compteur = 120;
  
    this.setSecondes(this.compteur);
    this.setMinutes(this.compteur);
    this.cptSubcription = this.gameService.cptSubject.subscribe(
      (cpt: number) => {

        if (this.compteur < 12) {
          this.cptClass = "uk-text-danger";
        } else {
          if (this.compteur < 32) {
            this.cptClass = "uk-text-warning";
          } else {
            this.cptClass = "uk-text-secondary";
          }

        }
        if (!(this.player.getHasPlayed())) {
          this.compteur = cpt;
          this.gameService.getCurrentPlayer().setCpt(cpt);
          this.setSecondes(this.compteur);
          this.setMinutes(this.compteur);
        }
        //this.currentPlayer = currentPlayer;
        // console.log("board : current player Update");
      }
    );
  }
  ngOnInit() {
    this.pokemonsList = allPokemons as IPokemon[];

    if (typeof this.player !== 'undefined' ) {
      if (Number.isInteger(this.player.getCpt())) {
        this.compteur = this.player.getCpt();
        this.setSecondes(this.compteur);
        this.setMinutes(this.compteur);
      }

    }
  }

  stopCpt() {
    console.log('stop cpt');
  }
  setSecondes(cpt: number) {
    this.secondes = ((cpt % 60) < 10) ? '0' + (cpt % 60) : (cpt % 60);
  }
  setMinutes(cpt: number) {
    this.minutes = '0' + (cpt - (cpt % 60)) / 60;
  }



  setRank(r: number) {
    this.player.setRank(r);
  }
  getRankPrefixe() {
    return this.rankPrefixe[this.getRank()];
  }
  getRank() {
    return this.player.getRank();
  }
  getusername() {
    return this.player.getUsername();
  }
  getHasPlayed() {
    return this.player.getHasPlayed();
  }
  getPokemonName() {
    return this.player.getPokemon();
  }
  setpickedBalls(pb: number) {
    this.player.setPickedBalls(pb);
  }
  getPickedBalls() {
    return this.player.getPickedBalls();
  }
  getPokemonImage(name) {
    let result = null;
    this.pokemonsList.forEach(e => {
      if (e.name === name) {
        result = e.image;
      }
    });
    return result;
  }

  getPokemonImageSrc() {
    return '../../assets/image/pokemon/' + this.getPokemonImage(this.player.getPokemon()) + '.svg';
  }
}
