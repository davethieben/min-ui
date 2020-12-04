
export class Dictionary<TKey, TValue = {}> extends Array<KeyValuePair<TKey, TValue>>
{
    constructor(private _equality?: ((x: TKey, y: TKey) => boolean))
    {
        super();

        if (_equality === undefined)
        {
            this._equality = (x, y) => x == y;
        }

    }

    public getIndexOf(key: TKey): number
    {
        return this.findIndex((pair) => this._equality(pair.key, key));
    }

    public tryGet(key: TKey): TValue
    {
        const index = this.getIndexOf(key);
        if (index >= 0)
        {
            return this[index].value;
        }
        else
        {
            return undefined;
        }
    }

    public addOrUpdate(key: TKey, value: TValue): void
    {
        const index = this.getIndexOf(key);
        if (index >= 0)
        {
            this[index].value = value;
        }
        else
        {
            this.push({ key, value });
        }
    }

    public getOrAdd(key: TKey, factory?: ((key: TKey) => TValue)): TValue
    {
        let value = this.tryGet(key);
        if (value === undefined)
        {
            value = factory(key);
            this.push({ key, value });
        }
        return value;
    }


}

export class KeyValuePair<TKey, TValue>
{
    public key: TKey;
    public value: TValue;
}