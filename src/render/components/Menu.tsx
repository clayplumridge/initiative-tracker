import * as React from "react";
import { Menu as MuiMenu, MenuProps as MuiMenuProps } from "@material-ui/core";
import { Observer } from "./Observer";
import { IObservableValue } from "@/render/core/Observable";

export interface MenuProps extends Omit<MuiMenuProps, "anchorEl" | "open"> {
    anchorEl: IObservableValue<null | HTMLElement>;
}

export const Menu: React.FC<MenuProps> = props => {
    const { anchorEl } = props;

    return (
        <Observer observed={{ anchorEl }}>
            {({ anchorEl }) => (
                <MuiMenu
                    {...props}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                >
                    {props.children}
                </MuiMenu>
            )}
        </Observer>
    );
};
