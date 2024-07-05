const SEVEN_BITS_INTEGER_MARKER: number = 0x7E;
const SIXTEEN_BITS_INTEGER_MARKER: number = 0x7F;

const MAXIMUM_SIXTEEN_BITS_INTEGER: number = 2 ** 16;
const MASK_KEY_BYTES_LENGTH: number = 0x04;
const OPCODE_TEXT: number = 0x01;

function encode(buffers: Buffer[], length: number): Buffer {
    const target: Buffer = Buffer.alloc(length);
    let offset: number = 0;

    for (let i: number = 0; i < buffers.length; i++) {
        target.set(buffers[i], offset);
        offset += buffers[i].length;
    }

    return target;
}

export function decode(encoded: Buffer, mask: Buffer): Buffer {
    const buffer: Buffer = Buffer.from(encoded);

    for (let i: number = 0; i < encoded.length; i++) {
        buffer[i] = encoded[i] ^ mask[i % MASK_KEY_BYTES_LENGTH];
    }

    return buffer;
}

// TODO
export function prepareMessage(message: Object): Buffer {
    const messageBuffer: Buffer = Buffer.from(JSON.stringify(message));

    if (messageBuffer.length > MAXIMUM_SIXTEEN_BITS_INTEGER) {
        throw new Error("Received message is too long! This server does not handle 64-bit messages!");
    }

    const byte: number = 0x80 | OPCODE_TEXT;
    let frameBuffer: Buffer;

    if (messageBuffer.length <= SEVEN_BITS_INTEGER_MARKER) {
        frameBuffer = Buffer.from([byte].concat(messageBuffer.length));
    } else {
        const targetBuffer: Buffer = Buffer.allocUnsafe(0x4);

        targetBuffer[0] = byte;
        targetBuffer[1] = SIXTEEN_BITS_INTEGER_MARKER | 0x0;

        targetBuffer.writeUint16BE(messageBuffer.length, 2);
        frameBuffer = targetBuffer;
    }

    const length: number = frameBuffer.byteLength + messageBuffer.length;

    return encode([frameBuffer, messageBuffer], length);
}
