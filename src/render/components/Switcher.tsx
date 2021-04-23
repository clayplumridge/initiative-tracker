import * as React from "react";
import { Observer } from ".";
import { IObservableValue } from "@/render/core/Observable";

export interface SwitcherProps<T extends string | number> {
    map: Record<T, React.ReactNode>;
    switchOn: IObservableValue<T>;
}

export function Switcher<T extends string | number>({
    map,
    switchOn
}: SwitcherProps<T>) {
    return (
        <Observer observed={{ switchOn }}>
            {({ switchOn }) => map[switchOn]}
        </Observer>
    );
}
