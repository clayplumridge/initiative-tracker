import { Theme } from "@material-ui/core";

export const Mixins = {
    rhythm: (theme: Theme, spacing: number, direction: "row" | "column") => {
        const selector = "& > *:not(:first-child)";

        switch (direction) {
            case "row":
                return {
                    [selector]: {
                        marginLeft: theme.spacing(spacing)
                    }
                };
            case "column":
                return {
                    [selector]: {
                        marginTop: theme.spacing(spacing)
                    }
                };
        }
    }
};
