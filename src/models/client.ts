import { Space } from "./space";

import { randomUUID, UUID } from "node:crypto";

export class Client {
    private readonly id: UUID;
    private readonly spaces: Map<UUID, Space>;

    constructor() {
        this.id = randomUUID();
        this.spaces = new Map();
    }

    public join(space: Space): void {
        if (!space.isAvailable()) {
            return;
        }

        if (this.spaces.has(space.getUUID())) {
            return;
        }

        space.add(this);
        this.spaces.set(space.getUUID(), space);
    }

    public leave(space: Space): void {
        if (!this.spaces.has(space.getUUID())) {
            return;
        }

        space.remove(this);
        this.spaces.delete(space.getUUID());
    }

    public getUUID(): UUID {
        return this.id;
    }

    public getSpaces(): Map<UUID, Space> {
        return this.spaces;
    }
}
