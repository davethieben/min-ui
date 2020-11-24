
export interface Command
{
    invokeAsync(command: any, args: any): Promise<boolean>;
}

export const Commands = {
    FetchCommand: "FetchCommand",
    FillCommand: "FillCommand"
};