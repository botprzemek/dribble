import { Timer } from "@/models/game/timer";

export class Quarter {
    private number: number;
    private timer: Timer.Quarter;

    constructor(number: number) {
        this.number = number;
        this.timer = new Timer.Quarter();
    }

    public getNumber = (): number => {
        return this.number;
    }

    public getTimer = (): Timer.Quarter => {
        return this.timer;
    }
}