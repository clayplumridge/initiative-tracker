import * as React from "react";
import {
    Checkbox as MuiCheckbox,
    CheckboxProps as MuiCheckboxProps
} from "@material-ui/core";
import { Observer } from ".";
import { IReadonlyObservableValue } from "@/render/core/Observable";

export interface CheckboxProps extends Omit<MuiCheckboxProps, "checked"> {
    checked: IReadonlyObservableValue<boolean>;
}

export const Checkbox: React.FC<CheckboxProps> = props => {
    const { checked } = props;

    return (
        <Observer observed={{ checked }}>
            {({ checked }) => <MuiCheckbox {...props} checked={checked} />}
        </Observer>
    );
};
