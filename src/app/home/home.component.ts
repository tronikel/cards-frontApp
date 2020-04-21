import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MyTokenService } from '../services/my-token.service';
import { GameService } from '../services/game.service';
declare var UIkit: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  key = 'token';

  joinPartyForm: FormGroup;
  newPartyForm: FormGroup;
  tokenRejected: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private myTokenservice: MyTokenService,
    private gameService: GameService) {
      this.tokenRejected = false;
    }

  ngOnInit() {
    this.initJoinPartyForm();
    this.initNewPartyForm();
    
  }

  initJoinPartyForm() {
    this.joinPartyForm = this.formBuilder.group({
      token: ['', [Validators.required, Validators.minLength(3)]],
    });
  }
  initNewPartyForm() {
    this.newPartyForm = this.formBuilder.group({});
  }

  joinParty() {
    console.log(this.joinPartyForm.value[this.key]);
    this.myTokenservice.checkToken(this.joinPartyForm.value[this.key])
      .subscribe(
        response => this.startparty(response, 'joiner'),
        error => console.error('Error!', error)
      );
    console.log('New Join');

  }


  newParty() {

    this.myTokenservice.createToken()
      .subscribe(
        response => this.startparty(response, 'master'),
        error => console.error('Error!', error)
      );
    console.log('New Party');

  }

  get token() {
    return this.joinPartyForm.get('token');
  }
  createGame() {
    this.gameService.setCode('test');
    this.router.navigate(['pseudo']);
  }

  startparty(input, type) {
    let result = '';
    result = result + input.message;
    if (result.split('-').length > 1) {
      if (result.split('-')[0] === 'Error token ') {
        this.tokenRejected = true;
        //UIkit.notification("<i class='uk-icon-close'></i> Code Inconnu : " + result.split('-')[1], { status: 'danger' });
      } else {
      //  UIkit.notification("<i class='uk-icon-check'></i> Code accepté : " + result.split('-')[1], { status: 'success' });
      this.tokenRejected = false;
        this.router.navigate(['../waitingPlayers'], { queryParams: { code: result.split('-')[1] , userType: type }});
       // this.router.navigate(['waitingPlayers']);
        console.log('navigate to waiting players Pseudo');
      }
    }
  }
}
