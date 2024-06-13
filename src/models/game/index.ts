import { Quarter } from "@/models/game/quarter";
import { Logger } from "@/models/logger";

export enum Status {
    
}

export class Game extends Logger {
    private readonly quarters: Quarter[];

    constructor() {
        super("%s [  GAME  ] %s");
        this.quarters = Array.from({ length: 4 }, (_, i) => new Quarter(i + 1));
        
        this.log("Started a Game");
        this.getQuarter(1)
            .getTimer()
            .start();
    }

    public getQuarter = (number: number): Quarter => {
        if (!this.quarters[number - 1]) {
            this.quarters[number - 1] = new Quarter(number);
        }

        return this.quarters[number - 1];
    }
}