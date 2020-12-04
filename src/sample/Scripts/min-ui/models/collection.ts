
export class Collection<T, TKey extends any = any> extends Array<T>
{
    private _keyExpr: ((item: T) => TKey);
    private _equality = (x: T, y: T) => this._keyExpr(x) === this._keyExpr(y);

    constructor(keyExpr?: ((item: T) => TKey), ...items: T[])
    {
        super(...items);

        if (keyExpr !== undefined)
        {
            this._keyExpr = keyExpr;
        }
        else
        {
            this._keyExpr = item => <any>item;
        }
    }

    public concat(...items: (T | ConcatArray<T>)[]): Collection<T, TKey>
    {
        return new Collection<T, TKey>(this._keyExpr, ...this, ...super.concat(...items));
    }

    public findIndex(target: (T | ((value: T, index: number, obj: T[]) => unknown))): number
    {
        const value = target as T;
        if (value !== undefined)
        {
            return super.findIndex(candidate => this._equality(candidate, value));
        }

        const predicate = target as ((value: T, index: number, obj: T[]) => unknown);
        if (predicate !== undefined)
        {
            return super.findIndex(predicate);
        }
    }

    public addOrUpdate(value: T): void
    {
        const index = this.findIndex(value);
        if (index >= 0)
        {
            this[index] = value;
        }
        else
        {
            this.push(value);
        }
    }

    public tryRemove(value: T): boolean
    {
        const index = this.findIndex(value);
        if (index >= 0)
        {
            this.splice(index, 1);
            return true;
        }
        else
        {
            return false;
        }
    }

}
