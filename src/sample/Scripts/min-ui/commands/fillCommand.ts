import { injectable } from "inversify";
import { Command } from "./command";
import { ParsedInvocation } from "../models/parsedInvocation";

interface FillOptions
{
    /** jQuery selector for target element */
    select: string;
    type: string;
}

@injectable()
export class FillCommand implements Command
{
    public get name() { return "fill"; };

    /**
     * fills a DOM element template with the results of a fetch call
     * @param command instructions for this command
     * @param args fetch results piped in from previous command
     * @example {'fill': {'select': '#teams', 'type': 'option'}
     */
    async invokeAsync(invocation: ParsedInvocation, args: any): Promise<boolean>
    {
        const fetch = args?.fetch?.response as Response;
        const options = args?.fill as FillOptions;

        if (fetch !== undefined && options !== undefined)
        {
            const target = $(document.body).find(options.select);
            if (target.length == 0)
                return false;

            return true;
        }
    }
}
