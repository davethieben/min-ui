
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
    public steps?: string[];
    public dispose: Function = () => { };
}
