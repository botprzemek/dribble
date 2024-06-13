import { Timer } from "@/models/game/timer";
import { Manager } from "@/models/game/manager";

export class Quarter {
    private number: number;
    private timer: Timer.Quarter;

    constructor(number: number) {
        this.number = number;
        this.timer = new Timer.Quarter();
    }

    public getNumber = (): number => {
        Manager.Game.get().log("My Quarter Number!");
        return this.number;
    }

    public getTimer = (): Timer.Quarter => {
        return this.timer;
    }
}