import { IPokemon } from '../interfaces/pokemon';

export class Player {

    private username: string;
    private pokemon: string;
    private isMainUser: boolean;
    private rank: number;
    private pickedBalls: number;
    private hasPlayed: boolean;
    private hand: number[];
    private cpt: number;
    private id: number;
    pokemonsList: IPokemon[];

    constructor(username, pokemon, isMainUser, cpt, id) {
        this.username = username;
        this.pokemon = pokemon;
        this.isMainUser = isMainUser;
        this.hasPlayed = false;
        this.rank = 1;
        this.pickedBalls = 0;
        this.hand = [];
        this.cpt = cpt;
        this.id = id;
    }

    create(p: Player) {
        const r = new Player(p.username, p.pokemon, p.isMainUser, p.cpt, p.id);
        r.hasPlayed = p.hasPlayed;
        r.rank = p.rank;
        r.pickedBalls = p.pickedBalls;
        r.hand = p.hand;
        r.cpt = p.cpt;
        r.id = p.id;
        return r;
    }
    addBalls(t) {
        this.pickedBalls = this.pickedBalls + t;
    }

    getid() {
        return this.id;
    }
    setId(id: number) {
        this.id = id;
    }
    getCpt() {
        return this.cpt;
    }
    setCpt(cpt: number) {
        this.cpt = cpt;
    }
    getUsername() {
        return this.username;
    }
    setUsername(username: string) {
        this.username = username;
    }
    getPokemon() {
        return this.pokemon;
    }
    setPokemon(pokemon: string) {
        this.pokemon = pokemon;
    }
    setIsMainUser(isMainUser: boolean) {
        this.isMainUser = isMainUser;
    }
    getIsMainUser(): boolean {
        return this.isMainUser;
    }
    setHasPlayed(hasPlayed: boolean) {
        this.hasPlayed = hasPlayed;
    }
    getHasPlayed(): boolean {
        return this.hasPlayed;
    }
    setRank(rank: number) {
        this.rank = rank;
    }
    getRank(): number {
        return this.rank;
    }
    setPickedBalls(pickedBalls: number) {
        this.pickedBalls = pickedBalls;
    }
    getPickedBalls(): number {
        return this.pickedBalls;
    }
    setHand(hand: number[]) {
        this.hand = hand;
    }
    getHand(): number[] {
        return this.hand;
    }
    addcardtohand(card: number) {
        this.hand.push(card);
    }
    getRankVisual() {
        let r = '' + this.getRank ;
        if (this.rank === 1) {
            r = '../../assets/image/pokemon/m1.png';
        }
        if (this.rank === 2) {
            r = '../../assets/image/pokemon/m2.png';
        }
        if (this.rank === 3) {
            r = '../../assets/image/pokemon/m3.png';
        }
        return r;
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
        return '../../assets/image/pokemon/' + this.getPokemonImage(this.pokemon) + '.svg';
    }
}
