export class Card {
    private ball: number;
    private number: number;
    private status: string;
    color: string;


    constructor(n: number) {
        this.status = '',
            this.number = n;
        if (n === 0) {
            this.ball = 0;
        } else {
            if ((n % 11) === 0) {
                this.ball = 5;
            } else {
                if ((n % 10) === 0) {
                    this.ball = 3;
                } else {
                    if ((n % 5) === 0) {
                        this.ball = 2;
                    } else {
                        this.ball = 1;
                    }
                }
            }

        }
    }
    create(c: Card) {
        return new Card(c.number);
    }
    getNumber() {
        return this.number;
    }
    getStatus() {
        return this.status;
    }
    setStatus(status: string) {
        this.status = status;
    }
    setNumber(n: number) {
        this.number = this.number;
    }
    getBall() {
        return this.ball;
    }
    setBall(b: number) {
        this.ball = b;
    }
    setColor(c: string) {
        this.color = c;
    }
    getColor() {
        return this.color;
    }
}
