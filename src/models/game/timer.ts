import { Handler } from "@/models/handler";

export namespace Timer {
    const LENGTH = {
        QUARTER: 10 * 60 * 1000,
        SHOT_CLOCK: 24 * 1000
    }

    class Timer {
        private handler: Handler.Game;

        private id: number | NodeJS.Timeout;
        private milliseconds: number = 0;
    
        constructor(handler: Handler.Game, length: number) {
            this.handler = handler;
            this.id = 0;
            this.milliseconds = length;
        }
    
        interval = (): void => {
            if (this.milliseconds === 0) {
                const quarter = this.handler.getGame().getActiveQuarter();
                
                if (!quarter) {
                    return;
                }
                
                quarter.end();
                return;
            }
            
            this.milliseconds -= 10;
        }
    
        run = (): void => {
            this.id = setInterval(this.interval, 10);
        }
    
        toggle = (): void => {
            const quarter = this.handler.getGame().getActiveQuarter();
            
            if (!quarter) {
                return;
            }

            this.id ? quarter.pause() : quarter.run();
        }
    
        stop = (): void => {
            clearInterval(this.id);
            this.id = 0;
        }
    
        format = (): string[] => [
            String(Math.floor(this.milliseconds / 60000)).padStart(2, "0"),
            String(Math.floor((this.milliseconds % 60000) / 1000)).padStart(2, "0"),
            String(this.milliseconds % 1000).padStart(3, "0")
        ]
    }

    export class Quarter extends Timer {
        constructor(handler: Handler.Game) {
            super(handler, LENGTH.QUARTER);
        }
    }

    export class ShotClock extends Timer {
        constructor(handler: Handler.Game) {
            super(handler, LENGTH.SHOT_CLOCK);
        }
    }
}