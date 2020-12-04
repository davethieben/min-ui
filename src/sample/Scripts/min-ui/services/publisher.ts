import { injectable } from "inversify";
import { Collection } from "../models/collection";
import { Dictionary } from "../models/dictionary";
import { MinEvent } from "../models/parsedInvocation";

export interface IPublisher
{
    subscribe(type: string, callback: ((e: MinEvent) => void)): Function;

    handleEvent(minEvent: MinEvent): void;
}

@injectable()
export class Publisher implements IPublisher
{
    private _registrations = new RegistrationCollection();

    public subscribe(type: string, callback: ((e: MinEvent) => void)): Function
    {
        return this._registrations.add(type, callback);
    }

    public handleEvent(minEvent: MinEvent)
    {
        let handlers = this._registrations.tryGet(minEvent.type) || new Collection<Callback>();
        const globalHandlers = this._registrations.tryGet("*");

        if (globalHandlers !== undefined && globalHandlers.length)
            handlers = handlers.concat(globalHandlers);

        for (const handler of handlers)
        {
            handler.fn(minEvent);
        }
    }

}

class RegistrationCollection extends Dictionary<string, Collection<Callback>>
{
    public add(type: string, callback: ((e: MinEvent) => void)): Function
    {
        const typeRegistrations = this.getOrAdd(type, () => new Collection<Callback>(cb => cb.id));

        const container = { id: ++RegistrationCollection._counter, fn: callback };
        typeRegistrations.push(container);

        return () =>
        {
            typeRegistrations.tryRemove(container);
        };
    }

    static _counter = 0;

}

interface Callback
{
    id: number;
    fn: ((e: MinEvent) => void);
}
