import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import * as process from "node:process";
import { fileURLToPath } from "node:url";

export interface Server {
    HOST: string;
    PORT: number;
}

const DEFAULT: Record<string, Server> = {
    SERVER: {
        HOST: "127.0.0.1",
        PORT: 3000,
    },
};

const NEWLINES_MATCH: RegExp = /\r\n|\n|\r/;
const VALUE_MATCH: RegExp = /^\s*([\w.-]+)\s*=\s*(.*)?\s*$/;

function format(key: string, value: string | number): string {
    return `${key.toUpperCase()}=${value}\n`;
}

function generate(name: string): string[] {
    return Object.entries(DEFAULT[name]).map(([key, value]): string =>
        format(key, value),
    );
}

function set(key: string, value: string): void {
    if (process.env[key] || process.env[key] === value) {
        return;
    }

    process.env[key] = value.toString();
}

function match(variables: Record<string, string>, line: string) {
    const matches: RegExpMatchArray | null = line.match(VALUE_MATCH);

    if (!(matches && matches[2])) {
        return;
    }

    variables[matches[1]] = matches[2];
}

function parse(source: Buffer): Record<string, string> {
    const variables: Record<string, string> = {};

    source
        .toString()
        .split(NEWLINES_MATCH)
        .forEach((line: string) => match(variables, line));

    return variables;
}

function load(name: string): void {
    const path: string = join(
        dirname(fileURLToPath(import.meta.url)),
        "../..",
        `.env.${name.toLowerCase()}`,
    );

    if (!existsSync(path)) {
        writeFileSync(path, generate(name).join(""));
        return;
    }

    const buffer: Buffer = readFileSync(path);
    const variables: Record<string, string> = parse(buffer);

    Object.entries(variables).forEach(([key, value]) => {
        if (!value) {
            return;
        }

        set(`${name}_${key}`, value);
    });
}

export function getServer(): Server {
    load("SERVER");

    return {
        HOST: process.env.SERVER_HOST || DEFAULT.SERVER.HOST,
        PORT: parseInt(process.env.SERVER_PORT || `${DEFAULT.SERVER.PORT}`),
    };
}
