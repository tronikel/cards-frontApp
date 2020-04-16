import { Component, OnInit, Input, OnDestroy, AfterViewInit } from '@angular/core';
import { Board } from '../models/board';
import { Card } from '../models/card';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as $ from 'jquery';
import { ChatService } from '../services/chat.service';
import { Player } from '../models/player';
import { GameService } from '../services/game.service';
declare var UIkit: any;


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy, AfterViewInit {
  players: Player[];
  currentPlayer: Player;
  currentPlayerSubject: Subscription;
  playersSubscription: Subscription;
  board: Board = new Board();
  boardSubscription: Subscription;
  notifSubcription: Subscription;
  endGameSubcription: Subscription;
  myHand: Card[];
  public employees = [];
  public errorMsg;
  public ranking = 'RAS';
  constructor(
    private gameService: GameService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private chatService: ChatService) {
    this.board = new Board();
  }

  ngOnInit() {
    this.players = this.gameService.getPlayers();
    this.currentPlayer = this.gameService.getCurrentPlayer();
    this.board = this.gameService.getBoard();
    this.dealcards();
    this.updateCurrentPlayerCards();
    this.notifSubcription = this.gameService.notifSubject.subscribe(
      (notif) => {
        if (notif['message'] === null) {

        } else {

          UIkit.notification("<i class='uk-icon-close'></i>" + notif['message'], { status: notif['style'] });
        }
      });




    this.playersSubscription = this.gameService.playersSubject.subscribe(
      (players: Player[]) => {
        this.players = players;
        //   console.log("board : players Update");
      });
    this.endGameSubcription = this.gameService.endGameSubject.subscribe(
      (message: string) => {
        if (message !== 'NO') {
          this.gameService.stopCptDecrement();
         
          this.updateranking();
          UIkit.modal.confirm(this.ranking).then((e) => {
            e.preventDefault();
            console.log('Confirm!');
            this.gameService = new GameService();
            this.router.navigate(['../home']);
          }, (e) => {
            console.log('Rejected.');
          });
        }
      });
    this.currentPlayerSubject = this.gameService.currentPlayerSubject.subscribe(
      (currentPlayer: Player) => {
        this.currentPlayer = currentPlayer;
        // console.log("board : current player Update");
      }

    );

    this.boardSubscription = this.gameService.boardSubject.subscribe(
      (board: Board) => {
        this.board = board;
      });

    this.chatService.observePartyUpdate().subscribe((message) => {
      console.log('update party');

      this.gameService.updateAll(message['content']).then(
        (val) => {
          this.gameService.emitPlayers();
          this.gameService.emitCurrentPlayer();
          this.gameService.emitBoard();
          this.gameService.emitRounds();
          this.gameService.emitStatus();
          this.gameService.emitEndGame();
          // console.log('update party : content updated');
          //console.log(this.gameService.getPlayers());
          //UIkit.notification("<i class='uk-icon-close'></i> La partie est lancée", { status: 'success' });
        },
        (err) => console.error(err)
      );

    });


  }

  updateranking() {
    let res = "<table class='uk-table uk-table-striped'>   <thead> <tr>  <th>Rang</th>  <th>Pseudo</th>   <th>Balles</th>   </tr>     </thead>     <tbody> ";

    this.gameService.getPlayers().forEach(e => {
      res = res + "<tr> <td>" + e.getRank() + + "</td> <td>" + e.getUsername() + "</td> <td>" + e.getPickedBalls() + "</td></tr>";
    });
    res = res + "</tbody>  </table>";
    this.ranking = res;
  }
  ngAfterViewInit() {
    this.gameService.decrementCpt();
    $("#players_nav_toggle").on("click", function () {
      if ($("#sub_nav").hasClass("hidden")) {
        $("#sub_nav").removeClass("hidden");
        $("#sub_nav").addClass("shown");
        $("#players_nav_toggle").html('<span id="myarrow" uk-icon="icon:  chevron-up" style = " background-color: rgba(255,255,255,.7);	padding :0px 2px;	border-radius: 0px 0px 5px 5px ;	cursor: pointer;">');
      } else {
        if ($("#sub_nav").hasClass("shown")) {
          $("#sub_nav").removeClass("shown");
          $("#sub_nav").addClass("hidden");
          $("#players_nav_toggle").html('<span  id="myarrow" uk-icon="icon:  chevron-down" style = " background-color: rgba(255,255,255,.7);	padding :0px 2px;	border-radius: 0px 0px 5px 5px ;	cursor: pointer;">');

        }
      }
    });
  }

  dealcards() {
    if (Array.isArray(this.players)) {
      if (this.players.length > 0) {
        this.players.forEach(player => {
          for (let index = 0; index < 10; index++) {
            player.addcardtohand(this.board.pickRandomCard());
          }
        });
      }
    }
  }

  updateCurrentPlayerCards() {
    if (Array.isArray(this.players)) {
      this.players.forEach(player => {
        if (player.getUsername() === this.currentPlayer.getUsername()) {
          this.currentPlayer.setHand(player.getHand());
        }
      });
    }
  }
  initplayerssection() {
    return null;
  }
  initboardsection() {
    return null;
  }
  initcurrentplayersection() {
    return null;
  }
  ngOnDestroy() {
    this.playersSubscription.unsubscribe();
  }
  isCurrent(player: Player) {
    return (player.getUsername() === this.currentPlayer.getUsername());
  }
}
