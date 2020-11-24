import { injectable } from "inversify";
import { ILogFactory, ILogger } from "./logFactory.js";

export interface IParser
{
    parse(fragment: JQuery): any[][];
}

@injectable()
export class Parser implements IParser
{
    private _logger: ILogger;

    constructor(logFactory: ILogFactory)
    {
        this._logger = logFactory.createLogger("Parser");
    }

    public parse(fragment: JQuery): any[][]
    {
        var commands = new Array<any[]>();

        fragment.find("[on]")
            .each((index: number, element: HTMLElement) =>
            {
                this._logger.debug(`found: ${element}`);

                let commandText = element.attributes["change"]?.value as string;
                commandText = (commandText || "").replace(/\'/g, "\"");

                let parsed = JSON.parse(commandText);
                if (!jQuery.isArray(parsed))
                    parsed = [parsed];

                commands.push(parsed);
            });

        return commands;
    }

}