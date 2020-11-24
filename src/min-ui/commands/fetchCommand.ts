import { injectable } from "inversify";
import { Command } from "./command.js";

interface FetchOptions
{
    url: string;
    init: RequestInit;
}

@injectable()
export class FetchCommand implements Command
{
    async invokeAsync(command: any, args: any): Promise<boolean>
    {
        args = args || {};
        args.fetch = args.fetch || {};

        const options = command?.fetch as FetchOptions;
        if (options !== undefined)
        {
            args.fetch.response = await fetch(options.url, options.init || {});

            return args.fetch.response?.ok ?? false;
        }
    }
}
