import { Handler } from "@/models/handler";
import { Timer } from "@/models/game/timer";

enum State {
    IDLING,
    PREPERING,
    STARTING,
    RUNNING,
    PAUSING,
    ENDING
}

const QUARTER_EVENT = "game:state";

export class Quarter {
    private handler: Handler.Game;

    private number: number;
    private state: State;
    private timer: Timer.Quarter;

    constructor(handler: Handler.Game, number: number) {
        this.handler = handler;
        this.number = number;
        this.state = State.IDLING;
        this.timer = new Timer.Quarter(this.handler);
    }

    public idle = (): Quarter => {
        this.state = State.IDLING;

        return this;
    }

    public prepare = (): Quarter => {
        this.state = State.PREPERING;
        this.handler.send(QUARTER_EVENT, `Quarter ${this.number + 1} prepared`, this.getState());

        return this;
    }

    public start = (): Quarter => {
        if (!this.isPreparing()) {
            return this;
        }

        this.state = State.STARTING;
        this.handler.send(QUARTER_EVENT, `Quarter ${this.number + 1} started`, this.getState());

        this.run();

        return this;
    } 

    public run = (): Quarter => {
        this.timer.run();

        this.state = State.RUNNING;
        this.handler.send(QUARTER_EVENT, `Quarter ${this.number + 1} ran`, this.getState());

        return this;
    } 

    public pause = (): Quarter => {
        if (this.isPausing()) {
            return this.start();
        }

        this.timer.stop();

        this.state = State.PAUSING;
        this.handler.send(QUARTER_EVENT, `Quarter ${this.number + 1} paused`, this.getState());

        return this;
    } 

    public end = (): Quarter => {
        this.timer.stop();

        this.state = State.ENDING;
        this.handler.send(QUARTER_EVENT, `Quarter ${this.number + 1} ended`, this.getState());

        this.handler.getGame().setActiveQuarter();

        return this;
    }

    public isIdling = (): boolean => {
        return this.state === State.IDLING;
    }

    public isPreparing = (): boolean => {
        return this.state === State.PREPERING;
    }

    public isStarting = (): boolean => {
        return this.state === State.STARTING;
    }

    public isRunning = (): boolean => {
        return this.state === State.RUNNING;
    }

    public isPausing = (): boolean => {
        return this.state === State.PAUSING;
    }

    public isEnding = (): boolean => {
        return this.state === State.ENDING;
    }

    public getNumber = (): number => {
        return this.number;
    }

    public getTimer = (): Timer.Quarter => {
        return this.timer;
    }

    public getState = (): State => {
        return this.state;
    }
}