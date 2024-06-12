export namespace action {
    export enum Status {
        PRE_GAME = 0,
        QUARTER = 1,
        END_OF_REGULATION = 2,
    }

    export enum Type {

    }

    export namespace data {
        export class {
            protected
        }
    }
}
    
export class Action {
    protected readonly status: Status;
    protected readonly type: Type;
    protected readonly data: unknown;
    protected valid: boolean;

    constructor() {
        this.valid = true;
    }
}