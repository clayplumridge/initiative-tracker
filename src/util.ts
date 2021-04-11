import * as React from "react";
import {
    IReadonlyObservableValue,
    ObservableValue
} from "./render/core/Observable";

export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function createSingletonGetter<T>(constructor: new () => T): () => T {
    let memo: T | undefined = undefined;

    return () => {
        if (!memo) {
            memo = new constructor();
        }

        return memo;
    };
}

export function useObservable<T>(
    initialValue: T
): [IReadonlyObservableValue<T>, (newValue: T) => void] {
    const [val] = React.useState(new ObservableValue<T>(initialValue));
    return [val, newValue => (val.value = newValue)];
}

export function css(...items: Array<string | undefined>) {
    return items.filter(isDefined).join(" ");
}

function isDefined<T>(obj: T | undefined): obj is T {
    return obj != undefined;
}
