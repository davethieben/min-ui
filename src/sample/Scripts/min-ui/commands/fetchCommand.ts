import { injectable } from "inversify";
import { Command } from "./command";

@injectable()
export class FetchCommand implements Command
{
    public get name() { return "fetch"; };

    public create(fnName: string): ((args: any) => Promise<boolean>)
    {
        if (fnName?.toLowerCase() === "fetch")
        {
            return this.invokeAsync;
        }

        return undefined;
    }

    async invokeAsync(args: any): Promise<boolean>
    {
        args = args || {};
        args.fetch = args.fetch || {};

        //const options = args?.fetch as FetchOptions;
        if (args.fetch.options === undefined)
        {
            args.fetch.options = { url: args.parameters[0] };
        }

        if (args.fetch.options.url !== undefined)
        {
            args.fetch.response = await fetch(args.fetch.options.url); // , options.init || {}

            return args.fetch.response?.ok ?? false;
        }
    }
}
