import { Game } from "@/models/game";
import { Person } from "@/models/person";
import { Timer } from "@/models/timer";

export class ScoreBoard {
    private readonly game: Game;
    private readonly shotClock: Timer.ShotClock;
    private readonly score: number[];

    constructor(game: Game) {
        this.game = game;
        this.shotClock = new Timer.ShotClock();

        this.score = [ 0, 0 ];
    }

    getShotClock = (): Timer.ShotClock => {
        return this.shotClock;
    }

    add(player: Person.Player, value: number): void {
        player.getStatistics();

    }
}