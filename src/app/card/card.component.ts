import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Card } from '../models/card';
import * as $ from 'jquery';
@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {
  preventSingleClick = false;
  timer: any;
  delay: number;
  @Input() status: string;
  @Input() color: string;
  @Input() number: number;
  @Input() isBoard: boolean;
  @Output() cardSelected = new EventEmitter<number>();
  @Output() cardHighlighted = new EventEmitter<number>();

  constructor() {
    this.status="";
   }

  ngOnInit() {

  }
  setcontent() {
    return ((this.number === 0) ? '?' : this.number);
  }

  singleClick() {
    if (this.isBoard) {
      return;
    }
    this.preventSingleClick = false;
    const delay = 200;
    this.timer = setTimeout(() => {
      if (!this.preventSingleClick) {
        this.cardHighlighted.emit(this.number);
      }
    }, delay);
  }
  setid() {
    return 'card' + this.number;
  }
  doubleClick() {
    if (this.isBoard) {
      return;
    }
    if (this.status !== 'busy') {
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    // alert('Double Click Event');
    this.cardSelected.emit(this.number);
    }
  }
  getballs() {
    return '../../assets/image/pokemon/' + (new Card(this.number)).getBall() + 'balls.png';
  }

  getColor(){
    return this.color;
  }
  isnull() {
    let test = false;
    test = (this.number === 0);
    return test as boolean;
  }
}
