import { Container, inject, injectable } from "inversify";
import container from "./inversify.config";
import { Services } from "./types";
import { IParser } from "./services/parser";
import { IPublisher } from "./services/publisher";
import { MinEvent } from "./models/parsedInvocation";
import { IExecutor } from "./services/executor";

declare global
{
    interface Window
    {
        min: Min;
    }
}

@injectable()
export class Min
{
    static readonly EVENT_NAMESPACE = ".min-ui";

    constructor(
        @inject(Services.Parser) private _parser: IParser,
        @inject(Services.Publisher) private _publisher: IPublisher,
        @inject(Services.Executor) private _executor: IExecutor,)
    {
    }

    public init(target?: HTMLElement)
    {
        this._executor.start();

        target = target || document.body;

        const invocations = this._parser.parseInvocations(target);

        for (const invocation of invocations)
        {
            for (const instruction of invocation.instructions)
            {
                for (let eventName of instruction.events)
                {
                    if (eventName && eventName.length)
                    {
                        eventName = eventName.trim() + Min.EVENT_NAMESPACE;

                        const handler = (minEvent: MinEvent) =>
                        {
                            this._publisher.handleEvent(minEvent);
                        };

                        $(invocation.originalTarget).on(eventName, instruction, handler);

                        instruction.dispose = () =>
                        {
                            $(invocation.originalTarget).off(eventName);
                        };
                    }
                }
            }

            $(invocation.originalTarget).triggerHandler("load" + Min.EVENT_NAMESPACE);
        }

        $(target).triggerHandler("load" + Min.EVENT_NAMESPACE);

        console.debug("Min.init done");
    }

    public static bootstrap(setup?: ((container: Container) => void)): Min
    {
        if (setup !== undefined)
        {
            setup(container);
        }

        const min = container.resolve(Min);
        min.init();

        window.min = min;
        return min;
    }

}

export default Min;
