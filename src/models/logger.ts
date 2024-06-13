export class Logger {
    private readonly format: string;

    constructor(format: string) {
        this.format = format;
    }

    private time = (date: Date): string[] => {
        return [
            String(date.getHours()).padStart(2, "0"),
            String(date.getMinutes()).padStart(2, "0"),
            String(date.getSeconds()).padStart(2, "0")
        ]
    }

    public log = (...parameters: Array<string | number | Error>): void => {
        console.log(this.format, this.time(new Date()).join(":"), ...parameters);
    }
}