import {
    IObservableArray,
    IObservableValue,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";

/**
 * Extracts the root type of one or more nested observables
 * Eg: ObservableArray<ObservableValue<string>> => string[]
 * ObservableArray<string> => string[]
 * ObservableValue<string> => string
 */
type UnwrappedObservableChain<T> = T extends IObservableArray<infer U>
    ? UnwrappedObservableChain<U>[]
    : T extends IObservableValue<infer U>
    ? UnwrappedObservableChain<U>
    : T;

/**
 * Unwraps all observable chains in the object for serialization purposes
 */
export type Serializable<T> = T extends Array<any>
    ? T
    : T extends Object
    ? {
          [P in keyof T]: Serializable<UnwrappedObservableChain<T[P]>>;
      }
    : T;

export function serialize<T>(value: T): Serializable<T> {
    if (value instanceof ObservableValue || value instanceof ObservableArray) {
        return unwrapObservableChain(value);
    } else if (Array.isArray(value)) {
        return [...value.map(x => serialize(x))] as Serializable<T>;
    } else if (typeof value == "object") {
        return Object.fromEntries(
            Object.entries(value).map(([key, value]) => {
                const unwrapped = unwrapObservableChain(value);

                if (typeof unwrapped == "object") {
                    return [key, serialize(unwrapped)];
                } else {
                    return [key, unwrapped];
                }
            })
        ) as Serializable<T>;
    } else {
        return value as Serializable<T>;
    }
}

function unwrapObservableChain<T>(
    value: IObservableArray<T>
): UnwrappedObservableChain<IObservableArray<T>>;
function unwrapObservableChain<T>(
    value: IObservableValue<T> | T
): UnwrappedObservableChain<IObservableValue<T>>;
function unwrapObservableChain<T>(
    value: IObservableArray<T> | IObservableValue<T> | T
): UnwrappedObservableChain<T[]> | UnwrappedObservableChain<T> {
    if (isObservableArray<T>(value)) {
        return [
            ...peel(value).map(x => unwrapObservableChain(x))
        ] as UnwrappedObservableChain<T[]>;
    } else if (isObservableValue<T>(value)) {
        return unwrapObservableChain(peel(value));
    } else {
        return value as UnwrappedObservableChain<T>;
    }
}

function peel<K>(value: IObservableArray<K>): K[];
function peel<K>(value: IObservableValue<K> | K): K;
function peel<K>(
    layer: IObservableArray<K> | IObservableValue<K> | K
): readonly K[] | K {
    if (isObservableValue<K>(layer) || isObservableArray<K>(layer)) {
        return layer.value;
    } else {
        return layer;
    }
}

function isObservableArray<T>(test: any): test is IObservableArray<T> {
    return test instanceof ObservableArray;
}

function isObservableValue<T>(test: any): test is IObservableValue<T> {
    return test instanceof ObservableValue;
}
