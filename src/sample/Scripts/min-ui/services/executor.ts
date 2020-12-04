import { inject, injectable, multiInject } from "inversify";
import { Services } from "../types";

import { MinEvent } from "../models/parsedInvocation";
import { Command, Commands } from "../commands/command";
import { IPublisher } from "./publisher";

export interface IExecutor 
{
    handleEvent(minEvent: MinEvent): void;
}

@injectable()
export class Executor implements IExecutor
{
    constructor(
        @inject(Services.Publisher) private _publisher: IPublisher,
        @multiInject(Commands.Command) private _commands: Command[])
    {
        _publisher.subscribe("*", this.handleEvent);

    }

    public handleEvent(minEvent: MinEvent)
    {
        for (const step of minEvent.data.steps)
        {
            console.log(`instruction - on '${minEvent.type}' executing: '${step}'`);

        }

    }

}