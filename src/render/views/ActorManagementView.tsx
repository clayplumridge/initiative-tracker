import * as React from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    createStyles,
    makeStyles
} from "@material-ui/core";
import { Restore as RestoreIcon } from "@material-ui/icons";
import { Observer, Switcher } from "@/render/components";
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

const viewMap: Record<Tab, React.ReactNode> = {
    [Tab.PCs]: undefined,
    [Tab.NPCs]: undefined
};

export const ActorManagementView: React.FC<{}> = () => {
    const styles = useViewStyles();
    const [selectedTab, setSelectedTab] = useObservable(Tab.NPCs);

    return (
        <Box className={styles.body} display="flex" flexDirection="column">
            <Switcher map={viewMap} switchOn={selectedTab} />

            <Observer observed={{ selectedTab }}>
                {({ selectedTab }) => (
                    <BottomNavigation
                        showLabels
                        className={styles.bottomNav}
                        onChange={(ev, newVal: Tab) => setSelectedTab(newVal)}
                        value={selectedTab}
                    >
                        <BottomNavigationAction
                            icon={<RestoreIcon />}
                            label="NPCs"
                            value={Tab.NPCs}
                        />
                        <BottomNavigationAction
                            icon={<RestoreIcon />}
                            label="PCs"
                            value={Tab.PCs}
                        />
                    </BottomNavigation>
                )}
            </Observer>
        </Box>
    );
};
