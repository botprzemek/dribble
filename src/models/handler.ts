import { Game as GameInstance } from "@/models/game";

import { Socket, Server as WebSocket } from "socket.io";
import { UUID } from "crypto";

export namespace Handler {
    export class Game {
        protected readonly io: WebSocket;
        protected socket: Socket;

        protected readonly game: GameInstance;

        constructor(io: WebSocket, socket: Socket, game: GameInstance) {
            this.io = io;
            this.socket = socket;
            this.game = game;

            this.join(this.game.getId());
            this.send("game:state", "Created a Game", this.game.getId());

            this.on("game:start", this.start);
        }
        
        public on = (event: string, listener: (...args: any[]) => void): void => {
            this.socket.on(event, listener);
        }
        
        public off = (event: string): void => {
            this.socket.removeAllListeners(event);
        }
        
        public join = (room: string): void => {
            this.socket.join(room);
        }

        public getGame = (): GameInstance => {
            return this.game;
        }

        public send = (event: string, ...args: any[]): void => {
            this.io.to(this.game.getId()).emit(event, ...args);
        }

        protected start = (id: UUID): void => {
            if (id !== this.game.getId()) {
                return;
            }

            const quarter = this.game.getActiveQuarter();
            
            if (!quarter) {
                return;
            }
            
            quarter.start();

            this.send("game:state", "Started a Game");
        }
    }
}