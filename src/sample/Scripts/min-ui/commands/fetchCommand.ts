import { injectable } from "inversify";
import { Command } from "./command";
import { ParsedInvocation } from "../models/parsedInvocation";

interface FetchOptions
{
    url: string;
    init: RequestInit;
}

@injectable()
export class FetchCommand implements Command
{
    public get name() { return "fetch"; };

    async invokeAsync(invocation: ParsedInvocation, args: any): Promise<boolean>
    {
        args = args || {};
        args.fetch = args.fetch || {};

        const options = args?.fetch as FetchOptions;
        if (options !== undefined)
        {
            args.fetch.response = await fetch(options.url, options.init || {});

            return args.fetch.response?.ok ?? false;
        }
    }
}
