import * as React from "react";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography
} from "@material-ui/core";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { Save as SaveIcon } from "@material-ui/icons";
import { TextField } from "@/render/components/TextField";
import { useObservable } from "@/util";

const useStyles = makeStyles(theme =>
    createStyles({
        buttonRow: {
            marginTop: theme.spacing(1)
        },
        firstButton: {
            marginLeft: "auto"
        }
    })
);

export const CreateEncounterView: React.FC<{}> = () => {
    const viewManager = getViewManager();
    const encounterManager = getEncounterManager();
    const [name, setName] = useObservable("");

    const create = () => {
        encounterManager.createNewEncounter({
            name: name.value,
            actors: []
        });

        viewManager.onViewChanged(View.EncounterManagement);
    };

    const styles = useStyles();

    return (
        <Box display="flex" flexDirection="column">
            <TextField
                label="Name"
                onChange={newValue => setName(newValue)}
                value={name}
            />

            <Box
                className={styles.buttonRow}
                display="flex"
                flexDirection="row"
            >
                <Button
                    className={styles.firstButton}
                    color="primary"
                    onClick={create}
                    startIcon={<SaveIcon />}
                    variant="contained"
                >
                    <Typography>Save</Typography>
                </Button>
            </Box>
        </Box>
    );
};
