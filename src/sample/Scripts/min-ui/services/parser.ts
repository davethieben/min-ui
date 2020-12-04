import { inject, injectable, multiInject } from "inversify";
import { Services } from "../types";

import { ParsedInvocation, ParsedInstruction, ParsedStep } from "../models/parsedInvocation";
import { Command, Commands } from "../commands/command";
import { ILogFactory, ILogger } from "./logFactory";

export interface IParser
{
    parseInvocations(fragment: JQuery<HTMLElement> | HTMLElement): ParsedInvocation[];
    parseStep(stepCode: string): ParsedStep;
}

@injectable()
export class Parser implements IParser
{
    private _logger: ILogger;

    constructor(
        @multiInject(Commands.Command) private _commands: Command[],
        @inject(Services.LogFactory) logFactory: ILogFactory)
    {
        this._logger = logFactory.createLogger("Parser");
    }

    public parseInvocations(fragment: JQuery<HTMLElement> | HTMLElement): ParsedInvocation[]
    {
        const invocations = this.find(fragment);

        // ex1: on="load => fetch('/api/weatherForecast/locations'); change => alert('hi $value') "
        // ex2: on="load, change => fetch('/api/weatherForecast/?location=$value') | fill('#weather-forecast')">

        for (const invocation of invocations)
        {
            const lines = invocation.commandText.split(";");
            for (const line of lines)
            {
                const parsed = /^([A-Za-z0-9, ()]+)=>(.+)$/
                    .exec(line);

                if (parsed?.length >= 3)
                {
                    const instr = new ParsedInstruction();

                    const eventText = parsed[1]?.trim();
                    instr.events = eventText.split(",");

                    const steps = parsed[2]?.trim().split("|");
                    for (const stepCode of steps)
                    {
                        const parsed = this.parseStep(stepCode);
                        instr.steps.push(parsed);
                    }

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

    public parseStep(stepCode: string): ParsedStep
    {
        // ex:  fetch('/api/weatherForecast/locations')
        //      alert('hi $value')
        // ex:  fetch('/api/weatherForecast/?location=$value')
        //      fill('#weather-forecast')

        stepCode = (stepCode || "").trim();

        const output = new ParsedStep(stepCode);

        const parsed = /^([A-Za-z, ]+)\((.+)\)$/
            .exec(stepCode);

        const functionName = parsed.length >= 1 && parsed[1];
        if (functionName !== undefined)
        {

            const argumentsText = parsed.length >= 2 && parsed[2];
            if (argumentsText !== undefined)
            {
                const parametersText = argumentsText.split(",");

                output.parameters = [];
                for (let index = 0; index < parametersText.length; index++)
                {
                    let parameterText = parametersText[index];
                    if (parameterText.startsWith("\'") && parameterText.endsWith("\'"))
                    {
                        // string:
                        parameterText = parameterText.substring(1, parameterText.length - 1).trim();
                        output.parameters[index] = parameterText;
                    }
                    else
                    {
                        output.parameters[index] = eval(parameterText); // dangerous?
                    }
                }
            }

            for (const command of this._commands)
            {
                const fn = command.create(functionName);
                if (fn !== undefined)
                {
                    output.compiled = fn;
                    break;
                }
            }

            if (output.compiled === undefined)
            {
                throw new Error("function not defined: " + functionName);
            }
        }

        return output;
    }

}
