import { injectable } from "inversify";
import { Command } from "../commands/command.js";

export interface IExecutor
{
    register(command: Command | { new(): any; }): void;
    invokeAsync(command: any, args: any): Promise<boolean>;
}

@injectable()
export class Executor implements IExecutor
{
    private _runners = new Array<Command>();

    constructor()
    {
    }

    public register(command: Command | (new () => any))
    {
        let ctor = command as { new(): any; };
        if (ctor !== undefined)
        {
            command = new ctor();
        }

        let impl = command as Command;
        impl && this._runners.push(impl);
    }

    public async invokeAsync(command: any, args: any): Promise<boolean>
    {
        for (let index = 0; index < this._runners.length; index++)
        {
            const result = await this._runners[index].invokeAsync(command, args);
            if (!result)
                return result;
        }

        return true;
    }


}