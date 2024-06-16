import { Statistics } from "@/models/game/statistics";

export namespace Person {
    class Person {
        protected readonly firstName: string;
        protected readonly lastName: string;
    
        constructor(firstName: string, lastName: string) {
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public getFirstName = (): string => {
            return this.firstName;
        }

        public getLastName = (): string => {
            return this.lastName;
        }
    }

    export class Player extends Person {
        private readonly number: number;
        private readonly statistics: Statistics.Player;
    
        constructor(firstName: string, lastName: string, number: number) {
            super(firstName, lastName);

            this.number = number;
            this.statistics = new Statistics.Player(this);
        }

        public getNumber = (): number => {
            return this.number;
        }

        public getStatistics = (): Statistics.Player => {
            return this.statistics;
        }
    }

    export class Coach extends Person {

    }

    export class Referee extends Person {
        
    }
}