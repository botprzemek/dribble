import { Quarter } from "@/models/game/quarter";
import { Handler } from "@/models/handler";

import { UUID } from "crypto";
import { Socket, Server as WebSocket } from "socket.io";

const QUARTER_AMOUNT = 4;

enum State {
    PREGAME,
    INGAME,
    POSTGAME
}

export class Game {
    private readonly handler: Handler.Game;

    private readonly id: UUID;
    private readonly quarters: Quarter[];

    constructor(io: WebSocket, socket: Socket, id: UUID) {
        this.id = id;
        this.handler = new Handler.Game(io, socket, this);
        this.quarters = Array.from(
            { length: QUARTER_AMOUNT },
            (_, number: number): Quarter => { 
                return new Quarter(this.handler, number);
            }
        );

        this.handler.getGame().setActiveQuarter();
    }

    public getId = (): UUID => {
        return this.id;
    }

    public getActiveQuarter = (): Quarter | undefined => {
        return this.quarters.find((quarter: Quarter) => {
            return !quarter.isIdling() && !quarter.isEnding()
        });
    }

    public setActiveQuarter = (): void => {
        const ended: number = this.quarters.filter((quarter: Quarter): boolean => {
            return quarter.isEnding();
        }).length;

        if (ended === QUARTER_AMOUNT) {
            this.handler.off("game:start");
            return;
        }

        this.quarters[ended].prepare();
    }
}