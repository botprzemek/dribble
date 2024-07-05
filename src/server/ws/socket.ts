import {createKey} from "@/server/utils/hash";
import {decode, prepareMessage} from "@/server/utils/buffer";
import {Logger} from "@/server/utils/logger";

import {IncomingMessage} from "node:http";
import {Duplex} from "node:stream";

interface HeadersData {
    privateKey: string
}

// TODO
const SEVEN_BITS_INTEGER_MARKER: number = 0x7D;
const SIXTEEN_BITS_INTEGER_MARKER: number = 0x7F;
const MASK_KEY_BYTES_LENGTH: number = 0x04;
const FIRST_BIT: number = 0x80;

function readable(socket: Duplex) {
    socket.read(0x01);

    const [length] = socket.read(0x01);
    const lengthIndicatorInBits: number = length - FIRST_BIT

    if (lengthIndicatorInBits > SIXTEEN_BITS_INTEGER_MARKER) {
        throw new Error("Received message is too long! This server does not handle 64-bit messages!");
    }

    let size: number = 0;

    if (lengthIndicatorInBits <= SEVEN_BITS_INTEGER_MARKER) {
        size = lengthIndicatorInBits
    } else {
        size = socket.read(0x02).readUint16BE(0x00)
    }

    const maskKey: Buffer = socket.read(MASK_KEY_BYTES_LENGTH);
    const encoded: Buffer = socket.read(size);
    const decoded: Buffer = decode(encoded, maskKey);
    const received: string = decoded.toString("utf-8");

    const data = JSON.parse(received)

    new Logger().log("Message received!", data);

    const message: Buffer = prepareMessage({
        message: data,
        at: new Date().toISOString()
    });

    socket.write(message);
}


function prepareHeaders(data: HeadersData): string {
    const key: string = createKey(data.privateKey);
    const end: string = "\r\n";
    return [
        'HTTP/1.1 101 Switching Protocols',
        'Upgrade: websocket',
        'Connection: Upgrade',
        `Sec-WebSocket-Accept: ${key}`,
        end
    ].join(end);
}

export function upgrade(request: IncomingMessage, socket: Duplex, _: Buffer): void {
    const {"sec-websocket-key": key} = request.headers;

    if (!key) {
        return;
    }

    socket.write(prepareHeaders({privateKey: key}));
    socket.on("readable", () => readable(socket));
}
