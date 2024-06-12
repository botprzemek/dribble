import "dotenv/config";

export namespace config {
    export type Server = {
        HOST: string,
        PORT: number,
    };

    export const address = (): Server => ({
        HOST: process.env.SERVER_HOST ? process.env.SERVER_HOST : "::",
        PORT: parseInt(process.env.SERVER_PORT ? process.env.SERVER_PORT : "60000"),
    });
}