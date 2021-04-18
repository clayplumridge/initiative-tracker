import * as React from "react";
import {
    createStyles,
    makeStyles,
    TextField as MuiTextField,
    TextFieldProps as MuiTextFieldProps
} from "@material-ui/core";
import { Observer } from "./Observer";
import { IObservableValue } from "@/render/core/Observable";
import { css } from "@/util";

export interface TextFieldProps
    extends Omit<MuiTextFieldProps, "onChange" | "value"> {
    onChange: (newValue: string) => void;
    value: IObservableValue<string>;
}

const useStyles = makeStyles(theme =>
    createStyles({
        field: {
            width: "100%"
        }
    })
);

export const TextField: React.FC<TextFieldProps> = props => {
    const { onChange, value } = props;
    const styles = useStyles();

    return (
        <Observer observed={{ value }}>
            {({ value }) => (
                <MuiTextField
                    {...props}
                    className={css(props.className, styles.field)}
                    onChange={ev => onChange(ev.target.value)}
                    value={value}
                />
            )}
        </Observer>
    );
};
