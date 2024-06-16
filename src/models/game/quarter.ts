import { Handler } from "@/models/handler";
import { Timer } from "@/models/game/timer";

enum State {
    IDLING,
    PREPARING,
    STARTING,
    RUNNING,
    PAUSING,
    ENDING
}

const QUARTER_EVENT: string = "game:state";

export class Quarter {
    private readonly handler: Handler.Game;

    private readonly number: number;
    private readonly timer: Timer.Quarter;
    private state: State;

    constructor(handler: Handler.Game, number: number) {
        this.handler = handler;
        this.number = number;
        this.timer = new Timer.Quarter(this.handler);
        this.state = State.IDLING;
    }

    public idle = (): Quarter => {
        this.state = State.IDLING;

        return this;
    }

    public prepare = (): Quarter => {
        this.state = State.PREPARING;
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
        return this.state === State.PREPARING;
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

    public getState = (): State => {
        return this.state;
    }

    public getTimer = (): Timer.Quarter => {
        return this.timer;
    }
}