import { Logger } from "@/models/logger";
import { Game as GameInstance } from "@/models/game";

export namespace Manager {
    export class Game extends Logger {
        private static manager: Game;
        private readonly games: { [ id: number ]: GameInstance };
        private next: number;

        constructor() {
            super("%s [ %s ] %s");
            this.games = [];
            this.next = 0;
        }

        public static get = (): Game => {
            if (!Game.manager) {
                Game.manager = new Game();
            }
            
            return Game.manager;
        }

        public add = (): void => {
            this.games[this.next] = new GameInstance(this.next++);
        }
        
        public delete = (game: GameInstance): void => {
            delete this.games[game.getId()]
        }
    }
}