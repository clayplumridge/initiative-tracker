import * as React from "react";
import { Add as AddIcon } from "@material-ui/icons";
import {
    Box,
    createStyles,
    Fab,
    Grid,
    makeStyles,
    Paper
} from "@material-ui/core";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { Observer } from "@/render/components/Observer";

const useStyles = makeStyles(theme =>
    createStyles({
        gridItemPaper: {
            padding: theme.spacing(2),
            color: theme.palette.text.secondary
        },
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
            <Grid container spacing={3}>
                <Observer
                    observed={{ encounters: encounterManager.getEncounters() }}
                >
                    {({ encounters }) => {
                        return (
                            <>
                                {encounters.map(x => (
                                    <Grid item>
                                        <Paper className={styles.gridItemPaper}>
                                            {x.name}
                                        </Paper>
                                    </Grid>
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
