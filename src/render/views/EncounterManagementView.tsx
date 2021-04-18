import * as React from "react";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    IconButton,
    ListItemIcon,
    makeStyles,
    MenuItem,
    Paper,
    Typography
} from "@material-ui/core";
import {
    Add as AddIcon,
    Delete as DeleteIcon,
    MoreVert as MoreVertIcon
} from "@material-ui/icons";
import { Menu, Observer } from "@/render/components";
import { Encounter } from "@/render/database/models";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { useObservable } from "@/util";

const useStyles = makeStyles(theme =>
    createStyles({
        fab: {
            bottom: theme.spacing(2),
            position: "absolute",
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

                        <Menu
                            keepMounted
                            anchorEl={anchorEl}
                            onClose={() => setAnchorEl(null)}
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
                    </Box>
                </Box>
            </Paper>
        </Grid>
    );
};
