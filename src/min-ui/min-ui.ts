import container from "./inversify.config";
import { Services } from "./types";
import { IExecutor } from "./services/executor";
import { IParser } from "./services/parser";
import { IPublisher } from "./services/publisher";

export class App
{
    constructor(
        private _parser: IParser,
        private _executor: IExecutor,
        private _publisher: IPublisher)
    {
    }

    public init(target?: JQuery)
    {
        target = target || jQuery(document.body);

        const commands = this._parser.parse(target);

        new Promise<never>(async (resolve, reject) =>
        {
            var args = { target };
            for (var command of commands)
            {
                if (!await this._executor.invokeAsync(command, args))
                    break;
            }

            console.debug("App.init done");
        });
    }

    public on(eventName: string, callback: (args: any) => void): Function
    {
        return this._publisher.subscribe(eventName, callback);
    }

    public static bootstrap(): App
    {
        const app = container.get<App>(Services.App);
        app.init();

        return app;
    }

}

export default App;
