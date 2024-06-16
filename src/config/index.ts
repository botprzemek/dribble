import { readFileSync, writeFileSync } from "fs";
import path from "path";
import { fileURLToPath } from 'url';

export namespace Config {
    const NEWLINES_MATCH: RegExp = /\r\n|\n|\r/
    const RE_INI_KEY_VAL: RegExp = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/

    const parse = (source: Buffer) => {
        const variables: { [ key: string ]: any } = {};
        source
            .toString()
            .split(NEWLINES_MATCH)
            .forEach((line: string) => {
                const matches: RegExpMatchArray | null = line.match(RE_INI_KEY_VAL);
                
                if (!matches) {
                    return;
                }

                const value: string = matches[2];

                if (!value) {
                    return;
                }

                variables[matches[1]] = value;
            }
        );

        return variables;
    }

    const load = (): void => {
        let variables: { [ key: string ]: any } = {};
        const filePath: string = path.join(path.dirname(fileURLToPath(import.meta.url)), "../..", ".env");

        try {
            const buffer: Buffer = readFileSync(filePath);

            variables = parse(buffer);

            const set = (key: string): void => {
                if (process.env[key] || process.env[key] === variables[key]){
                    return;
                }

                process.env[key] = variables[key];
            }

            Object
              .keys(variables)
              .map(set);
        }
        catch (error: any) {
            writeFileSync(filePath, "HOST = 127.0.0.1\nPORT = 3000\n");
        }
    }
    
    export type Server = {
        HOST: string,
        PORT: number,
    };

    export const Server = (): Server => {
        load();

        return {
            HOST: process.env.SERVER_HOST ? process.env.SERVER_HOST : "127.0.0.1",
            PORT: parseInt(process.env.SERVER_PORT ? process.env.SERVER_PORT : "3000"),    
        }
    };
}
