import * as React from "react";
import {
    IReadonlyObservableArray,
    IReadonlyObservableValue,
    ObservableArray,
    ObservableValue
} from "./render/core/Observable";

/**
 * If T is an Array, returns the type of the Array elements
 * Otherwise, returns T
 */
export type UnwrapArray<T> = T extends Array<infer U> ? U : T;

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Creates a function that can be used to retrieve a singleton
 * Stores the singleton within the function closure
 * Creates lazily (at first call to the returned function) unless constructNow is set to true
 */
export function createSingletonGetter<T>(
    constructor: new () => T,
    constructNow = false
): () => T {
    let memo: T | undefined = constructNow ? new constructor() : undefined;

    return () => {
        if (!memo) {
            memo = new constructor();
        }

        return memo;
    };
}

/**
 * React Hook that mimics React.useState but uses an Observable instead
 * Use for any UI-local Observables that you need
 */
export function useObservable<T>(
    initialValue: T
): [IReadonlyObservableValue<T>, (newValue: T) => void] {
    const [val] = React.useState(new ObservableValue<T>(initialValue));
    return [val, newValue => (val.value = newValue)];
}

/**
 * React Hook that mimics React.useState but uses an Observable instead
 * Use for any UI-local Observables that you need
 */
export function useObservableArray<T>(
    initialValue: T[]
): [IReadonlyObservableArray<T>, (newValue: T[]) => void] {
    const [val] = React.useState(new ObservableArray<T>(initialValue));
    return [val, newValue => (val.value = newValue)];
}

/**
 * Concats several strings into a valid string of CSS classes
 * Used when accepting a className as a prop and wanting to stamp some styles of your own
 */
export function css(...items: Array<string | undefined>) {
    return items.filter(isDefined).join(" ");
}

/**
 * Asserts than an object is not undefined
 * Use to do things like arr.filter(isDefined) to get good type narrowing
 */
function isDefined<T>(obj: T | undefined): obj is T {
    return obj != undefined;
}

export type PartialShallow<T> = {
    [P in keyof T]?: T[P] extends object ? object : T[P];
};
