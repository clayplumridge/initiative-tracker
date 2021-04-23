import * as React from "react";
import {
    BottomNavigation,
    BottomNavigationAction,
    Box,
    createStyles,
    Grid,
    IconButton,
    ListItemIcon,
    makeStyles,
    MenuItem,
    Paper,
    Typography
} from "@material-ui/core";
import {
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon,
    Restore as RestoreIcon
} from "@material-ui/icons";
import { Menu, Observer, Switcher } from "@/render/components";
import { ActorTemplate, ActorType } from "@/render/database/models";
import {
    Filter,
    getActorTemplateManager
} from "@/render/state/ActorTemplateManager";
import { useObservable } from "@/util";

const enum Tab {
    PCs = "pcs",
    NPCs = "npcs"
}

const ActorTemplateDisplay: React.FC<{ filter: Filter }> = ({ filter }) => {
    const manager = getActorTemplateManager();
    const templates = manager.search(filter);

    return (
        <Grid container>
            <Observer observed={{ templates }}>
                {({ templates }) =>
                    templates.map(x => (
                        <ActorTemplateGridItem actorTemplate={x} />
                    ))
                }
            </Observer>
        </Grid>
    );
};

const useItemStyles = makeStyles(theme =>
    createStyles({
        flexCenteredRow: {
            alignItems: "center"
        },
        gridItemPaper: {
            color: theme.palette.text.secondary,
            padding: theme.spacing(1)
        },
        menuButton: {
            marginLeft: "auto"
        }
    })
);

const ActorTemplateGridItem: React.FC<{ actorTemplate: ActorTemplate }> = ({
    actorTemplate
}) => {
    const manager = getActorTemplateManager();
    const styles = useItemStyles();
    const [anchorEl, setAnchorEl] = useObservable<null | HTMLElement>(null);

    return (
        <Grid item sm={12}>
            <Paper className={styles.gridItemPaper}>
                <Box display="flex" flexDirection="column">
                    <Box
                        className={styles.flexCenteredRow}
                        display="flex"
                        flexDirection="row"
                    >
                        <Typography>{actorTemplate.name}</Typography>

                        <IconButton
                            className={styles.menuButton}
                            onClick={ev => setAnchorEl(ev.currentTarget)}
                        >
                            <MoreVertIcon />
                        </IconButton>

                        <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
                        >
                            <MenuItem
                                onClick={() => manager.delete(actorTemplate.id)}
                            >
                                <ListItemIcon>
                                    <DeleteIcon />
                                </ListItemIcon>
                                <Typography noWrap variant="inherit">
                                    Delete
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};

const viewMap: Record<Tab, React.ReactNode> = {
    [Tab.PCs]: <ActorTemplateDisplay filter={{ actorType: ActorType.PC }} />,
    [Tab.NPCs]: <ActorTemplateDisplay filter={{ actorType: ActorType.NPC }} />
};

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
