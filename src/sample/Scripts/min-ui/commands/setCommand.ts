import { injectable } from "inversify";
import { Command } from "./command";

@injectable()
export class SetCommand implements Command
{
    public get name() { return "set"; };

    public create(fnName: string): ((args: any) => Promise<boolean>)
    {
        if (fnName?.toLowerCase() === "set")
        {
            return (args: any) =>
            {
                const setArguments = args["arguments"] as string[];
                if (setArguments && setArguments.length >= 2)
                {
                    const key = setArguments[0];
                    const value = setArguments[1];

                    args[key] = value;

                    return Promise.resolve(true);
                }

                return Promise.resolve(false);
            };
        }

        return undefined;
    }

}
