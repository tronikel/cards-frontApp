import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';

import { GameService } from './services/game.service';
import { ChatService } from './services/chat.service';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChatComponent } from './chat/chat.component';
import { HomeComponent } from './home/home.component';
import { WaitingPlayersComponent } from './waiting-players/waiting-players.component';
import { BoardComponent } from './board/board.component';
import { PlayerComponent } from './player/player.component';
import { MyHandComponent } from './my-hand/my-hand.component';
import { CardComponent } from './card/card.component';
import { EmployeeService } from './services/employee.service';

const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  // { path: 'pseudo', canActivate: [CodeGuard], component: PseudoComponent},
  // { path: 'waitingPlayers/:code/:usertype', component: WaitingPlayersComponent},
  { path: 'waitingPlayers', component: WaitingPlayersComponent },
  { path: 'board', component: BoardComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChatComponent,
    HomeComponent,
    WaitingPlayersComponent,
    BoardComponent,
    PlayerComponent,
    MyHandComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes),
    AppRoutingModule
  ],
  providers: [ChatService, GameService, EmployeeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
