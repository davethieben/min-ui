import { inject, injectable } from "inversify";
import { Services } from "../types.js";
import { ILogFactory, ILogger } from "./logFactory.js";

export interface IParser
{
    parse(fragment: JQuery<HTMLElement> | HTMLElement): ParsedCommand[];
}

@injectable()
export class Parser implements IParser
{
    private _logger: ILogger;

    constructor(@inject(Services.LogFactory) logFactory: ILogFactory)
    {
        this._logger = logFactory.createLogger("Parser");
    }

    public parse(fragment: JQuery<HTMLElement> | HTMLElement): ParsedCommand[]
    {
        var commands = new Array<ParsedCommand>();

        var jqElem = fragment as JQuery<HTMLElement>;
        if (jqElem?.jquery === undefined)
            jqElem = $(fragment);

        jqElem.find("[on]")
            .each((index: number, element: HTMLElement) =>
            {
                this._logger.debug(`found: ${element}`);

                let commandText = element.attributes.getNamedItem("on")?.value as string;
                //commandText = (commandText || "").replace(/\'/g, "\"");
                //let parsed = JSON.parse(commandText);

                //if (!jQuery.isArray(parsed))
                //    parsed = [parsed];

                commands.push({
                    originalTarget: element,
                    commandText
                });
            });

        return commands;
    }

}

export class ParsedCommand
{
    public originalTarget?: HTMLElement;
    public commandText?: string;

}
