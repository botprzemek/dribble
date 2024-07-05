export class Logger {
    private readonly format: string;

    constructor(format: string = "%s [LOG]: %s") {
        this.format = format;
    }

    public log = (...parameters: Array<string | number | Error>): void => {
        console.log(this.format, this.time(new Date()).join(":"), ...parameters);
    }

    public error = (...parameters: Array<string | number | Error>): void => {
        console.error(this.format, this.time(new Date()).join(":"), ...parameters);
    }

    private time = (date: Date): string[] => {
        return [
            String(date.getHours()).padStart(2, "0"),
            String(date.getMinutes()).padStart(2, "0"),
            String(date.getSeconds()).padStart(2, "0")
        ]
    }
}