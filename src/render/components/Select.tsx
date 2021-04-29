import * as React from "react";
import {
    createStyles,
    FormControl,
    InputLabel,
    makeStyles,
    Select as MuiSelect,
    SelectProps as MuiSelectProps
} from "@material-ui/core";
import { Observer } from "./Observer";
import { IReadonlyObservableValue } from "@/render/core/Observable";
import { css } from "@/util";

export interface SelectProps extends MuiSelectProps {
    label?: string;
    value: IReadonlyObservableValue<any>;
}

const useStyles = makeStyles(theme =>
    createStyles({
        formControl: {
            minWidth: "100%"
        }
    })
);

export const Select: React.FC<SelectProps> = props => {
    const { className, label, value, children } = props;
    const styles = useStyles();

    return (
        <FormControl className={css(styles.formControl, className)}>
            {label && <InputLabel>{label}</InputLabel>}
            <Observer observed={{ value }}>
                {({ value }) => (
                    <MuiSelect {...props} value={value}>
                        {children}
                    </MuiSelect>
                )}
            </Observer>
        </FormControl>
    );
};
