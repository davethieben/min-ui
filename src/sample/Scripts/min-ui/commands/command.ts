
export interface Command
{
    name: string;
    create(fnName: string): ((args: any) => Promise<boolean>);
}

export const Commands = {
    Command: Symbol.for("Command"),
    FetchCommand: Symbol.for("FetchCommand"),
    FillCommand: Symbol.for("FillCommand")
};
