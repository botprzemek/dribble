import {readFileSync, writeFileSync} from "fs";
import {fileURLToPath} from "url";
import {dirname, join} from "path";
import * as process from "node:process";

export interface Server {
    HOST: string,
    PORT: number,
}

const DEFAULT: { [key: string]: Server } = {
    SERVER: {
        HOST: "127.0.0.1",
        PORT: 3000
    }
}

const NEWLINES_MATCH: RegExp = /\r\n|\n|\r/
const RE_INI_KEY_VAL: RegExp = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/

function format(key: string, value: string | number): string {
    return `${key.toUpperCase()}=${value}\n`;
}

function generate(): string {
    return Object.entries(DEFAULT).map(([type, config]): string => {
        return Object.entries(config).map(([key, value]): string => {
            return format(key, value);
        }).join("");
    }).join("");
}

function set(key: string, value: string | undefined): void {
    if (process.env[key] || process.env[key] === value) {
        return;
    }

    process.env[key] = value;
}

function parse(source: Buffer): { [key: string]: any } {
    const variables: { [key: string]: any } = {};

    source
        .toString()
        .split(NEWLINES_MATCH)
        .forEach((line: string) => {
            const matches: RegExpMatchArray | null = line.match(RE_INI_KEY_VAL);
            if (matches && matches[2]) {
                variables[matches[1]] = matches[2];
            }
        });

    return variables;
}

function load(configType: string, fileName: string): void {
    const path: string = join(dirname(fileURLToPath(import.meta.url)), "../..", fileName);

    try {
        const buffer: Buffer = readFileSync(path);
        const variables = parse(buffer);

        Object.entries(variables).forEach(([key, value]) => set(`${configType}_${key}`, value));
    } catch (error) {
        writeFileSync(path, generate());
    }
}

export function Server(): Server {
    load("SERVER", ".env.server");

    return {
        HOST: !process.env.SERVER_HOST
            ? DEFAULT.SERVER.HOST
            : process.env.SERVER_HOST,
        PORT: !process.env.SERVER_PORT || isNaN(parseInt(process.env.SERVER_PORT))
            ? DEFAULT.SERVER.PORT
            : parseInt(process.env.SERVER_PORT),
    }
}
