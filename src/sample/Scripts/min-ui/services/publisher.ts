import { injectable } from "inversify";

export interface IPublisher
{
    subscribe(name: string, callback: (args: any) => void): Function;

}

@injectable()
export class Publisher implements IPublisher
{
    private _registrations: { [key: string]: any; } = {};

    subscribe(name: string, callback: (args: any) => void): Function
    {
        let registrations = this._registrations[name] as any[];
        if (registrations === undefined)
        {
            registrations = new Array<any>();
            this._registrations[name] = registrations;
        }

        registrations.push(callback);

        return () =>
        {
            var i = registrations.indexOf(callback);
            if (i >= 0 && i < registrations.length)
                registrations = registrations.splice(i, 1);
        };
    }

}