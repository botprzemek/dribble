import { Client } from "./client";

import { randomUUID, UUID } from "node:crypto";

export class Space {
    private readonly id: UUID;
    private readonly clients: Map<UUID, Client>;
    private available: boolean;

    constructor() {
        this.id = randomUUID();
        this.clients = new Map();
        this.available = false;
    }

    public add(client: Client): void {
        if (!this.available) {
            return;
        }

        if (this.clients.has(client.getUUID())) {
            return;
        }

        this.clients.set(client.getUUID(), client);
    }

    public remove(client: Client): void {
        if (!this.clients.has(client.getUUID())) {
            return;
        }

        this.clients.delete(client.getUUID());
    }

    public close(): void {
        this.available = false;
    }

    public open(): void {
        this.available = true;
    }

    public getUUID(): UUID {
        return this.id;
    }

    public getClients(): Map<UUID, Client> {
        return this.clients;
    }

    public isAvailable(): boolean {
        return this.available;
    }
}
