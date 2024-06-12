import { Person } from "@/models/person";

export class Team {
    private readonly players: Person.Player[]

    constructor(players: Person.Player[]) {
        this.players = players;
    }

    public addPlayer = (player: Person.Player): Team => {
        this.players.push(player);
        return this;
    }

    public getPlayers = (): Person.Player[] => {
        return this.players;
    }
}