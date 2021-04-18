import { createEmitter, Emitter, EventMap } from "@/render/core/EventEmitter";

interface ObservableValueEventMap<T> extends EventMap {
    change: ObservableChange<T>;
}

export interface ObservableChange<T> {
    old: T;
    new: T;
}

export interface IObservableValue<T>
    extends Emitter<ObservableValueEventMap<T>> {
    value: T;
}

export interface IReadonlyObservableValue<T>
    extends Emitter<ObservableValueEventMap<T>> {
    readonly value: T;
}

export class ObservableValue<T> implements IObservableValue<T> {
    private readonly emitter = createEmitter<ObservableValueEventMap<T>>();

    constructor(private _value: T) {}

    public on = this.emitter.on;
    public off = this.emitter.off;
    public emit = this.emitter.emit;

    public get value(): T {
        return this._value;
    }

    public set value(val: T) {
        const oldValue = this._value;
        this._value = val;
        this.emit("change", { new: this._value, old: oldValue });
    }
}

export interface IObservableArray<T>
    extends IObservableValue<ReadonlyArray<T>> {
    /**
     * Appends items to the end of the array and notifies consumers
     */
    push(...items: T[]): number;

    /**
     * Removes an item from the end of the array, returns it, and notifies consumers
     */
    pop(): T | undefined;

    /**
     * Removes an item from the front of the array, returns it, and notifies consumers
     */
    shift(): T | undefined;

    /**
     * Adds items to the front of the array and notifies consumers
     */
    unshift(...items: T[]): number;
}

export type IReadonlyObservableArray<T> = IReadonlyObservableValue<
    ReadonlyArray<T>
>;
type ObservableArrayEventMap<T> = ObservableValueEventMap<ReadonlyArray<T>>;

export class ObservableArray<T> implements IObservableArray<T> {
    private readonly emitter = createEmitter<ObservableArrayEventMap<T>>();

    constructor(private _value: T[] = []) {}

    private createEmit<F extends (...args: any[]) => any>(
        func: F
    ): (...args: Parameters<F>) => ReturnType<F> {
        return (...args: Parameters<F>) => {
            const old = [...this.value];
            const result = func(...args);
            this.emit("change", { new: this._value, old });
            return result;
        };
    }

    public push = this.createEmit((...items: T[]) =>
        this._value.push(...items)
    );
    public pop = this.createEmit(() => this._value.pop());
    public shift = this.createEmit(() => this._value.shift());
    public unshift = this.createEmit((...items: T[]) =>
        this._value.unshift(...items)
    );

    public on = this.emitter.on;
    public off = this.emitter.off;
    public emit = this.emitter.emit;

    public get value() {
        return this._value as ReadonlyArray<T>;
    }

    public set value(val: ReadonlyArray<T>) {
        const old = [...this.value];
        this._value = val as T[];
        this.emit("change", { new: this._value, old });
    }
}
