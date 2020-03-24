import { Card } from './card';
export class Board {
  rowNb = 4;
  colNb = 6;
  table: Card[][];
  box = new Array(104);

  constructor() {
    this.table = [];
    for (let i = 0; i < this.box.length; i++) {
      this.box[i] = i + 1;
    }
    for (let i = 0; i < this.rowNb; i++) {
      this.table[i] = [];
      this.table[i][0] = new Card(this.pickRandomCard());
      for (let j = 1; j < this.colNb; j++) {
        this.table[i][j] = new Card(0);
      }
    }
  }
  create(b: Board) {
    const r = new Board();
    const c = new Card(0);
    r.box = b.box;
    for (let i = 0; i < this.rowNb; i++) {
      for (let j = 0; j < this.rowNb; j++) {
        r.table[i][j] = c.create(b.table[i][j]);
      }
    }
    return r;
  }
  boardinittest() {
    for (let i = 0; i < this.rowNb; i++) {
      this.table[i] = [];
      for (let j = 0; j < this.colNb; j++) {
        this.table[i][j] = new Card(this.pickRandomCard());
      }
    }
  }
  pickRandomCard() {
    const r: number = Math.floor(Math.random() * this.box.length);
    const t = this.box[r];
    this.remove(t);
    return t;
  }

  remove(e) {
    for (let i = 0; i < this.box.length; i++) {
      if (this.box[i] === e) {
        this.box.splice(i, 1);
      }
    }
  }

  getVector() {
    const temp = [];
    for (let i = 0; i < this.rowNb; i++) {
      let j = 0;
      let temp1 = {};
      while ((this.table[i][j].getNumber() !== 0) && (j < this.colNb)) {
        //   console.log(this.table[i][j]);

        temp1 = {
          l: i,
          c: j ,
          n: this.table[i][j].getNumber()
        };

        j++;
      }
      temp.push(temp1);

    }
    return temp.sort(this.sortNumber);
  }
  sortNumber(a, b) {
    return a.n - b.n;
  }
  public putCard(card) {
    let iPos = -1;
    let jPos = -1;
    let min = -1;
    let minTotal = -1;
    let minPos = -1;
    this.table.forEach((row, i) => {
      const firstZeroIndex: number = row.findIndex((elt) => {
        return elt.getNumber() === 0;
      });
      const diff = card - (row[firstZeroIndex - 1].getNumber());
      if (diff > 0 && (min < 0 || diff < min)) {
        min = diff;
        iPos = i;
        jPos = firstZeroIndex;
      }
      const total = row.reduce((a, b) => new card(a.getNumber() + b.getNumber()));
      if (minTotal < 0 || total.getNumber() < minTotal) {
        minTotal = total.getNumber();
        minPos = i;
      }
    });
    if (iPos < 0 || jPos < 0) {
      this.table[minPos] = [card, 0, 0, 0, 0, 0];
      return minTotal;
    }
    if (jPos === this.colNb - 1) {
      const total = this.table[iPos].reduce((a, b) => new card(a.getNumber() + b.getNumber()));
      this.table[iPos] = [card, 0, 0, 0, 0, 0];
      return total;
    }
    this.table[iPos][jPos] = card;
    return 0;
  }
}
