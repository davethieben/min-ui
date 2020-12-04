import { inject, injectable } from "inversify";
import { Services } from "../types";

import { MinEvent } from "../models/parsedInvocation";
import { IPublisher } from "./publisher";

export interface IExecutor 
{
    start(): void;
    stop(): void;
}

@injectable()
export class Executor implements IExecutor
{
    private _unsubscribe: Function;

    constructor(@inject(Services.Publisher) private _publisher: IPublisher)
    {
    }

    public start()
    {
        this._unsubscribe = this._publisher.subscribe("*", this.handleEvent);

    }

    public stop()
    {
        this._unsubscribe?.call(this);

    }

    async handleEvent(minEvent: MinEvent): Promise<void>
    {
        const instruction = minEvent.data;
        const context = { e: minEvent, instruction };

        for (const step of instruction.steps)
        {
            if (step.compiled !== undefined)
            {
                console.log(`instruction - on '${minEvent.type}' executing: '${step.rawText}'`);

                const result = await step.compiled({ ...context, parameters: step.parameters });
                if (!result)
                    break;
            }
        }
    }

}
