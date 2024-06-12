export namespace Timer {
    const LENGTH = {
        QUARTER: 10 * 60 * 1000,
        SHOT_CLOCK: 24 * 1000
    }

    class Timer {
        protected id: number | NodeJS.Timeout;
        protected milliseconds: number = 0;
    
        constructor(length: number) {
            this.id = 0;
            this.milliseconds = length;
        }
    
        run = (): void => {
            if (this.milliseconds === 0) {
                this.toggle();
                return;
            }
            
            this.milliseconds -= 10;
        }
    
        start = (): void => {
            this.id = setInterval(this.run, 10);
        }
    
        toggle = (): void => {
            if (this.id) {
                this.stop();
                return;
            }
    
            this.start();
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
        constructor() {
            super(LENGTH.QUARTER);
        }
    }

    export class ShotClock extends Timer {
        constructor() {
            super(LENGTH.SHOT_CLOCK);
        }
    }
}