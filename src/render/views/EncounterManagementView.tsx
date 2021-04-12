import * as React from "react";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon
} from "@material-ui/icons";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    IconButton,
    ListItemIcon,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Typography
} from "@material-ui/core";
import { Encounter } from "@/render/database/models";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { Observer } from "@/render/components/Observer";
import { useObservable } from "@/util";

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            position: "absolute",
            bottom: theme.spacing(2),
            right: theme.spacing(2)
        }
    })
);

export const EncounterManagementView: React.FC<{}> = () => {
    const viewManager = getViewManager();
    const encounterManager = getEncounterManager();
    const styles = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <Grid container spacing={1}>
                <Observer
                    observed={{ encounters: encounterManager.getEncounters() }}
                >
                    {({ encounters }) => {
                        return (
                            <>
                                {encounters.map(x => (
                                    <EncounterGridItem
                                        encounter={x}
                                        key={x.id}
                                    />
                                ))}
                            </>
                        );
                    }}
                </Observer>
            </Grid>

            <Fab
                className={styles.fab}
                color="primary"
                onClick={() => viewManager.onViewChanged(View.CreateEncounter)}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
};

const useItemStyles = makeStyles(theme =>
    createStyles({
        gridItemPaper: {
            padding: theme.spacing(1),
            color: theme.palette.text.secondary
        },
        flexCenteredRow: {
            alignItems: "center"
        },
        menuButton: {
            marginLeft: "auto"
        }
    })
);

const EncounterGridItem: React.FC<{ encounter: Encounter }> = ({
    encounter
}) => {
    const encounterManager = getEncounterManager();
    const styles = useItemStyles();
    const [anchorEl, setAnchorEl] = useObservable<null | HTMLElement>(null);

    return (
        <Grid item sm={6} xs={12}>
            <Paper className={styles.gridItemPaper}>
                <Box display="flex" flexDirection="column">
                    <Box
                        className={styles.flexCenteredRow}
                        display="flex"
                        flexDirection="row"
                    >
                        <Typography>{encounter.name}</Typography>

                        <IconButton
                            className={styles.menuButton}
                            onClick={ev => setAnchorEl(ev.currentTarget)}
                        >
                            <MoreVertIcon />
                        </IconButton>

                        <Observer observed={{ anchorEl }}>
                            {({ anchorEl }) => (
                                <Menu
                                    keepMounted
                                    anchorEl={anchorEl}
                                    onClose={() => setAnchorEl(null)}
                                    open={Boolean(anchorEl)}
                                >
                                    <MenuItem
                                        onClick={() =>
                                            encounterManager.deleteEncounter(
                                                encounter.id
                                            )
                                        }
                                    >
                                        <ListItemIcon>
                                            <DeleteIcon />
                                        </ListItemIcon>
                                        <Typography noWrap variant="inherit">
                                            Delete
                                        </Typography>
                                    </MenuItem>
                                </Menu>
                            )}
                        </Observer>
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};
