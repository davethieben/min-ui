import { inject } from "inversify";
import container from "./inversify.config";
import { Services } from "./types";
import { IExecutor } from "./services/executor";
import { IParser } from "./services/parser";
import { IPublisher } from "./services/publisher";

declare global
{
    interface Window
    {
        min: Min;
    }
}

export class Min
{
    constructor(
        @inject(Services.Parser) private _parser: IParser,
        @inject(Services.Executor) private _executor: IExecutor,
        @inject(Services.Publisher) private _publisher: IPublisher)
    {
    }

    public init(target?: HTMLElement)
    {
        target = target || document.body;

        const commands = this._parser.parse(target);

        async function execute()
        {
            const args = { target };
            for (const command of commands)
            {
                if (!await this._executor.invokeAsync(command, args))
                    break;
            }

            console.debug("App.init done");
        }

        execute();
    }

    public on(eventName: string, callback: (args: any) => void): Function
    {
        return this._publisher.subscribe(eventName, callback);
    }

    public static bootstrap(): Min
    {
        const min = container.get<Min>(Services.Min);
        min.init();

        window.min = min;
        return min;
    }

}

export default Min;
