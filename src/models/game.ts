import { Quarter } from "@/models/quarter";

export enum Status {
    
}

export class Game {
    private readonly quarters: Quarter[];

    constructor() {
        this.quarters = Array.from({ length: 4 }, (_, i) => new Quarter(i + 1));
    }

    getQuarters = (): Quarter[] => {
        return this.quarters;
    }
}