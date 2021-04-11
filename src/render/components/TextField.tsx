import * as React from "react";
import { IObservableValue } from "@/render/core/Observable";
import {
    TextField as MuiTextField,
    TextFieldProps as MuiTextFieldProps
} from "@material-ui/core";
import { Observer } from "./Observer";

export interface TextFieldProps
    extends Omit<MuiTextFieldProps, "onChange" | "value"> {
    onChange: (newValue: string) => void;
    value: IObservableValue<string>;
}

export const TextField: React.FC<TextFieldProps> = props => {
    const { onChange, value } = props;

    return (
        <Observer observed={{ value }}>
            {({ value }) => (
                <MuiTextField
                    {...props}
                    onChange={ev => onChange(ev.target.value)}
                    value={value}
                />
            )}
        </Observer>
    );
};
