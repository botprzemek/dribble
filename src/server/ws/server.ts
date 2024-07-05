import {upgrade} from "@/server/ws/socket";
import {Server} from "@/server/utils/config";
import {Logger} from "@/server/utils/logger";
import {ErrorHandler} from "@/server/utils/errorHandler";

import {createServer} from "node:http";

export class WS {
    private readonly logger: Logger;

    constructor(config: Server = Server()) {
        new ErrorHandler();

        this.logger = new Logger("%s [WS]:");

        createServer()
            .on("upgrade", upgrade)
            .listen(config.PORT, config.HOST, () => this.logger.log(`Listening on ws://${config.HOST}:${config.PORT}/`));
    }
}