import * as React from "react";
import { IObservableValue } from "@/render/core/Observable";

type UnpackObservable<T> = T extends IObservableValue<infer Q> ? Q : never;
type ObservableBag = Record<string, IObservableValue<unknown>>;
type UnpackedObservableBag<T extends ObservableBag> = {
    [propName in keyof T]: UnpackObservable<T[propName]>;
};

export interface ObserverProps<T extends ObservableBag> {
    /**
     * Strongly-typed React children for functional child smartness
     */
    children: (values: UnpackedObservableBag<T>) => JSX.Element | JSX.Element[];
    observed: T;
}

export function Observer<T extends ObservableBag>({
    children,
    observed
}: ObserverProps<T>) {
    const [observedValues, setObservedValues] = React.useState<
        UnpackedObservableBag<T>
    >(() => {
        const keys = Object.keys(observed) as (keyof T)[];
        return keys.reduce(
            (rollup, key) => ({ ...rollup, [key]: observed[key].value }),
            {} as UnpackedObservableBag<T>
        );
    });

    const updateObservedValues = <Key extends keyof T>(
        key: Key,
        val: T[Key]["value"]
    ) => {
        setObservedValues({ ...observedValues, [key]: val });
    };

    React.useEffect(() => {
        Object.keys(observed).forEach(key =>
            observed[key].on("change", change =>
                updateObservedValues(key, change.new)
            )
        );

        return () =>
            Object.keys(observed).forEach(key =>
                observed[key].off("change", change =>
                    updateObservedValues(key, change.new)
                )
            );
    }, []);

    return <>{children(observedValues)}</>;
}
