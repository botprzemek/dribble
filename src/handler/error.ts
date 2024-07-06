import { Logger } from "@/utils/logger";

const EXCEPTIONS: string[] = ["uncaughtException", "unhandledRejection"];

const logger: Logger = new Logger("%s [ERROR]:");

function event(event: string, logger: Logger): void {
    process.on(event, (error: Error): void => {
        logger.error(
            `An error occurred on "${event}": ${error.stack || error}`,
        );
    });
}

export function registerExceptions(): void {
    EXCEPTIONS.forEach((name: string): void => {
        event(name, logger);
    });
}
