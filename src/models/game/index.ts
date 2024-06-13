import { Quarter } from "@/models/game/quarter";
import { Logger } from "@/models/logger";

export class Game extends Logger {
    private readonly id: number;
    private readonly quarters: Quarter[];

    constructor(id: number) {
        super(`%s [ GAME:${id} ] %s`);
        
        this.id = id;
        this.quarters = Array.from({ length: 4 }, (_, i) => new Quarter(i + 1));
    
        this.getQuarter(0)
            .getTimer()
            .start();
    }

    public getId = (): number => {
        return this.id;
    }

    public getQuarter = (number: number): Quarter => {
        if (!this.quarters[number - 1]) {
            this.quarters[number - 1] = new Quarter(number);
        }

        return this.quarters[number - 1];
    }
}