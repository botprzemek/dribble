import { Logger } from "@/models/logger";
import { Config } from "@/config";
import { Manager } from "@/models/game/manager";

import { createServer, Server as HttpServer } from "http";
import { Socket, Server as WebSocket } from "socket.io";

export namespace Server {
    export type Options = {
        connectionStateRecovery: Object
    }

    export class WS extends Logger {
        protected readonly io: WebSocket;
        protected readonly manager: Manager.Game;

        constructor(host?: string, port?: number, options?: Options) {
            super("%s [ SERVER ] %s");

            const server: HttpServer = createServer()
                .listen(
                    port ?? Config.Server().PORT,
                    host ?? Config.Server().HOST,
                    this.listen
                );
        
            this.io = new WebSocket(
                server,
                options ?? { connectionStateRecovery: {} } as Options
            );
            this.manager = new Manager.Game;

            this.io.on("connection", this.connect);
        }

        protected listen = (): void => {
            this.log("Server started");
        };

        protected connect = (socket: Socket): void => {
            this.log(`Client connected (${socket.id})`);

            socket.on("disconnect", (): void => {
                this.log(`Client disconnected (${socket.id})`);
            });

            socket.on("game:create", (): void => {
                this.manager.add(this.io, socket);
            });
        }

        public close = (): void => {
            this.log("Server stopped");
            this.io.close();
        }

        protected error = (error: Error): void => {
            this.log(`Error occured: ${error}`);
        }
    }
}