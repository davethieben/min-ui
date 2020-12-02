import { injectable } from "inversify";

export interface ILogFactory
{
    createLogger(name: string): ILogger;
}

export interface ILogger
{
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
}

@injectable()
export class LogFactory implements ILogFactory
{
    createLogger(name: string): ILogger
    {
        return new Logger(name);
    }

}

class Logger implements ILogger
{
    constructor(private _name: string)
    {
    }

    private format(level: string, message: string): string
    {
        return `${new Date().toLocaleTimeString()} [${level}] ${this._name} - ${message}`;
    }

    public debug(message: string)
    {
        console.debug(this.format("DEBUG", message));
    }

    public info(message: string)
    {
        console.info(this.format("INFO", message));
    }

    public warn(message: string)
    {
        console.warn(this.format("WARN", message));
    }

    public error(message: string)
    {
        console.error(this.format("ERROR", message));
    }

}