import { Game as GameInstance } from "@/models/game";

import { Socket, Server as WebSocket } from "socket.io";
import { UUID, randomUUID } from "crypto";

export namespace Manager {
    export class Game {
        readonly games: { [ id: UUID ]: GameInstance };

        constructor() {
            this.games = {};
        }

        public add = (io: WebSocket, socket: Socket): void => {
            const id: UUID = randomUUID();
            this.games[id] = new GameInstance(io, socket, id);
        }

        public get = (id: UUID): GameInstance | undefined => {
            return this.games[id];
        }
        
        public delete = (id: UUID): void => {
            delete this.games[id];
        }
    }
}