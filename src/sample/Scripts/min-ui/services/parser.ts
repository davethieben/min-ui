import { inject, injectable } from "inversify";
import { Services } from "../types";

import { ParsedInvocation, ParsedInstruction } from "../models/parsedInvocation";
import { ILogFactory, ILogger } from "./logFactory";

export interface IParser
{
    parse(fragment: JQuery<HTMLElement> | HTMLElement): ParsedInvocation[];
}

@injectable()
export class Parser implements IParser
{
    private _logger: ILogger;

    constructor(@inject(Services.LogFactory) logFactory: ILogFactory)
    {
        this._logger = logFactory.createLogger("Parser");
    }

    public parse(fragment: JQuery<HTMLElement> | HTMLElement): ParsedInvocation[]
    {
        const invocations = this.find(fragment);

        // ex1: on="load => fetch('/api/weatherForecast/locations'); change => alert('hi $value') "
        // ex2: on="load, change => fetch('/api/weatherForecast/?location=$value') | fill('#weather-forecast')">

        for (const invocation of invocations)
        {
            const lines = invocation.commandText.split(";");
            for (const line of lines)
            {
                const parsed = /^([A-Za-z, ]+)=>(.+)$/
                    .exec(line);

                if (parsed?.length >= 3)
                {
                    const instr = new ParsedInstruction();

                    const eventText = parsed[1]?.trim();
                    instr.events = eventText.split(",");

                    const stepsText = parsed[2]?.trim();
                    instr.steps = stepsText.split("|");

                    invocation.instructions.push(instr);
                }
                else
                {
                    this._logger.warn(`Invalid instruction: "${line}"`);
                }
            }
        }

        return invocations;
    }

    private find(fragment: JQuery<HTMLElement> | HTMLElement): ParsedInvocation[]
    {
        const invocations = new Array<ParsedInvocation>();

        var jqElem = fragment as JQuery<HTMLElement>;
        if (jqElem?.jquery === undefined)
            jqElem = $(fragment);

        jqElem.find("[on]")
            .each((index: number, element: HTMLElement) =>
            {
                invocations.push(new ParsedInvocation(element));
            });

        return invocations;
    }

}
