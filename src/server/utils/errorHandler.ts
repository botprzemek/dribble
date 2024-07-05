import {Logger} from "@/server/utils/logger";

export class ErrorHandler {
    private readonly logger: Logger;
    private readonly EXCEPTIONS: string[] = [
        "uncaughtException",
        "unhandledRejection"
    ];

    constructor() {
        this.logger = new Logger("%s [ERROR]:");

        this.register();
    }

    private register(): void {
        this.EXCEPTIONS.forEach((event: string): void => {
            this.event(event, this.logger);
        });
    }

    private event(event: string, logger: Logger): void {
        process.on(event, (error: Error): void => {
            logger.error(`An error occurred on "${event}": ${error.stack || error}`);
        });
    }
}