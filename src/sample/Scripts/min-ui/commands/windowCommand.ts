import { injectable } from "inversify";
import { Command } from "./command";

@injectable()
export class WindowCommand implements Command
{
    public get name() { return "window"; };

    readonly supported = ["alert"];

    public create(fnName: string): ((args: any) => Promise<boolean>)
    {
        if (this.supported.some(name => fnName === name) && fnName in window)
        {
            return (args: any) =>
            {
                const fn = (window as any)[fnName] as Function;
                if (fn !== undefined)
                    fn.call(window, args.arguments);

                return Promise.resolve(true);
            };
        }

        return undefined;
    }

}
