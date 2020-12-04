import { ParsedInvocation } from "../models/parsedInvocation";

export interface Command
{
    name: string;
    invokeAsync(invocation: ParsedInvocation, args: any): Promise<boolean>;
}

export const Commands = {
    Command: Symbol.for("Command"),
    FetchCommand: Symbol.for("FetchCommand"),
    FillCommand: Symbol.for("FillCommand")
};
