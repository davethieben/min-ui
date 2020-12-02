import { injectable } from "inversify";
import { ILogFactory, ILogger } from "./logFactory.js";

export interface IParser
{
    parse(fragment: JQuery<HTMLElement> | HTMLElement): any[][];
}

@injectable()
export class Parser implements IParser
{
    private _logger: ILogger;

    constructor(logFactory: ILogFactory)
    {
        this._logger = logFactory.createLogger("Parser");
    }

    public parse(fragment: JQuery<HTMLElement> | HTMLElement): any[][]
    {
        var commands = new Array<any[]>();

        var jqElem = fragment as JQuery<HTMLElement>;
        if (jqElem === undefined)
            jqElem = $(fragment);

        jqElem.find("[on]")
            .each((index: number, element: HTMLElement) =>
            {
                this._logger.debug(`found: ${element}`);

                let commandText = element.attributes.getNamedItem("change")?.value as string;
                commandText = (commandText || "").replace(/\'/g, "\"");

                let parsed = JSON.parse(commandText);
                if (!jQuery.isArray(parsed))
                    parsed = [parsed];

                commands.push(parsed);
            });

        return commands;
    }

}
