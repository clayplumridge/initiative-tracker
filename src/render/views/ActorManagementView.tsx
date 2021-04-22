import * as React from "react";
import {
    BottomNavigation,
    Box,
    createStyles,
    makeStyles
} from "@material-ui/core";
import { useObservable } from "@/util";

const enum Tab {
    PCs = "pcs",
    NPCs = "npcs"
}

const useViewStyles = makeStyles(theme =>
    createStyles({
        body: {
            height: "100%"
        },
        bottomNav: {
            margin: `auto -${theme.spacing(1)}px -${theme.spacing(
                1
            )}px -${theme.spacing(1)}px`
        }
    })
);

export const ActorManagementView: React.FC<{}> = () => {
    const styles = useViewStyles();
    const [selectedTab, setSelectedTab] = useObservable(Tab.NPCs);
    return (
        <Box className={styles.body} display="flex" flexDirection="column">
            <BottomNavigation className={styles.bottomNav}></BottomNavigation>
        </Box>
    );
};
