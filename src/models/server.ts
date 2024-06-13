import { Logger } from "@/models/logger";
import { Config } from "@/config";
import { Game } from "@/models/game";

import { createServer, Server as HttpServer } from "http";
import { Socket, Server as WebSocket } from "socket.io";

export namespace Server {
    export type Options = {
        connectionStateRecovery: Object
    }

    export class WS extends Logger {
        protected readonly socket: WebSocket;
        protected readonly games: Game[];

        constructor(host?: string, port?: number, options?: Options) {
            super("%s [ SERVER ] %s");

            const server: HttpServer = createServer()
                .listen(
                    port ?? Config.Server().PORT,
                    host ?? Config.Server().HOST,
                    this.listen
                );
        
            this.socket = new WebSocket(
                server,
                options ?? { connectionStateRecovery: {} } as Options
            ).on("connection", this.connect);
            
            this.games = [];
        }

        protected listen = (): void => {
            this.log("Server started");
            this.games.push(new Game());
        };

        protected connect = (socket: Socket): void => {


            this.log(`Client connected (${socket.id})`);
            
            socket.on("message", (message: string): void => {
                this.log(`Recived message: ${message} (From ${socket.id})`);
                this.socket.emit("message", message);
            });
        
            socket.on("disconnect", (): void => {
                this.log(`Client disconnected (${socket.id})`);
            });
        }

        protected receive = (data: Buffer): void => {
        }

        public send = (host: string, port: number, data: any): void => {
        }

        public close = (): void => {
            this.log("Server stopped");
            this.socket.close();
        }

        protected error = (error: Error): void => {
            this.log(`Error occured: ${error}`);
        }
    }
}