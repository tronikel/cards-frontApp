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
  delay: Number;
  color: String;
  @Input() number: number;
  @Input() isBoard: boolean;
  @Output() cardSelected = new EventEmitter<number>();
  @Output() cardHighlighted = new EventEmitter<number>();

  constructor() { }

  ngOnInit() {
    this.color = this.isBoard ? 'FFFFFF' : 'F5F5F5';

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
    this.preventSingleClick = true;
    clearTimeout(this.timer);
    // alert('Double Click Event');
    this.cardSelected.emit(this.number);
  }
  getballs() {
    return '../../assets/image/pokemon/' + (new Card(this.number)).getBall() + 'balls.png';
  }
  isnull() {
    let test = false;
    test = (this.number === 0);
    return test as boolean;
  }
}
