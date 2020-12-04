
export interface MinEvent extends JQuery.TriggeredEvent<any, ParsedInstruction> { }

export class ParsedInvocation
{
    constructor(target: HTMLElement)
    {
        this.originalTarget = target;
        this.commandText = target.attributes.getNamedItem("on")?.value as string;
        this.instructions = [];
    }

    public originalTarget?: HTMLElement;
    public commandText?: string;
    public instructions: ParsedInstruction[] = [];
}

export class ParsedInstruction
{
    public events?: string[];
    public steps: ParsedStep[] = [];
    public dispose: Function = () => { };
}

export class ParsedStep
{
    constructor(stepText: string)
    {
        if (!stepText || !stepText.length)
            throw new Error("stepText is required");

        this.rawText = stepText;
    }

    public rawText?: string;
    public compiled?: ((args: any) => Promise<boolean>);
    public parameters: any[];


}
