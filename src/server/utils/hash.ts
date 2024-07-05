import {createHash} from "node:crypto";

const WEBSOCKET_PUBLIC: string = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

export function createKey(key: string): string {
    return createHash("sha1")
        .update(key + WEBSOCKET_PUBLIC)
        .digest("base64");
}