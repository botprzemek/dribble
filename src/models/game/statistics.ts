import { Person } from "@/models/person";

export namespace Statistics {
    export namespace Shot {
        export enum Type {
            TWO_POINTER = 2,
            THREE_POINTER = 3,
            FREE_THROW = 1
        }

        abstract class Base {
            protected readonly type: Type;
            private attempted: number = 0;
            private made: number = 0;

            constructor(type: Type) {
                this.type = type;
            }

            public attempt(made?: boolean): number {
                this.attempted++;
                if (made) {
                    this.made++;
                    return this.type;
                }
                return 0;
            }

            public getAttempted(): number {
                return this.attempted;
            }

            public getMade(): number {
                return this.made;
            }
        }

        export class TwoPointer extends Base {
            constructor() {
                super(Type.TWO_POINTER);
            }
        }

        export class ThreePointer extends Base {
            constructor() {
                super(Type.THREE_POINTER);
            }
        }

        export class FreeThrow extends Base {
            constructor() {
                super(Type.FREE_THROW);
            }
        }
    }

    class BaseStatistics {
        protected shots: {
            twoPointer: Shot.TwoPointer;
            threePointer: Shot.ThreePointer;
            freeThrow: Shot.FreeThrow;
        };
        protected rebounds: { offensive: number; defensive: number } = { offensive: 0, defensive: 0 };
        protected assists: number = 0;
        protected steals: number = 0;
        protected blocks: number = 0;
        protected turnovers: number = 0;
        protected fouls: { personal: number; flagrants: number } = { personal: 0, flagrants: 0 };

        constructor() {
            this.shots = {
                twoPointer: new Shot.TwoPointer(),
                threePointer: new Shot.ThreePointer(),
                freeThrow: new Shot.FreeThrow()
            };
        }

        public getShots(): typeof this.shots {
            return this.shots;
        }
    }

    export class Player extends BaseStatistics {
        private playerRef: Person.Player;
        private minutes: number = 0;

        constructor(player: Person.Player) {
            super();
            this.playerRef = player;
        }
    }
}