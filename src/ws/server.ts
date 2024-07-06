import { upgrade } from "@/ws/socket";
import { getServer, Server as ServerConfig } from "@/utils/config";
import { Logger } from "@/utils/logger";

import { createServer, Server } from "node:http";

// TODO
// Handle ERRNOADDR
interface ServerError extends Error {
    errno?: number;
    code?: string;
    path?: string;
    syscall?: string;
    stack?: string;
}

export class WS {
    private readonly logger: Logger;
    private readonly server: Server;

    constructor() {
        this.logger = new Logger("%s [WS]: %s");

        this.server = createServer();
        this.server.on("upgrade", upgrade);
    }

    public start(config: ServerConfig = getServer()): void {
        this.server.listen(config.PORT, config.HOST, () => {
            this.logger.log(`Listening on ws://${config.HOST}:${config.PORT}/`);
        });
    }
}
