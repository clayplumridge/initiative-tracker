import { Theme } from "@material-ui/core";

export const Mixins = {
    /**
     * Creates a selector that will apply margin to all children of this element except the first one
     * Essentially it creates gutters between child elements in a Flex Container
     */
    rhythm: (theme: Theme, spacing: number, direction: "row" | "column") => {
        // CSS selector for all immediate children of this element that are not the first child
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
