import { Component, OnInit, Input } from '@angular/core';
import allPokemons from '../../assets/json/pokemons.json';
import { IPokemon } from '../interfaces/pokemon';
import { Player } from '../models/player';
import { GameService } from '../services/game.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit {

  @Input() player: Player;
  @Input() isCurrent: boolean;

  pokemonsList: IPokemon[];

  constructor() {

  }

  ngOnInit() {
    this.pokemonsList = allPokemons as IPokemon[];
  }

  setRank(r: number) {
    this.player.setRank(r);
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
