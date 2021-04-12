import * as React from "react";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography
} from "@material-ui/core";
import { Cancel as CancelIcon, Save as SaveIcon } from "@material-ui/icons";
import { css, useObservable } from "@/util";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { TextField } from "@/render/components";

const useStyles = makeStyles(theme =>
    createStyles({
        buttonRow: {
            marginTop: theme.spacing(1)
        },
        firstButton: {
            marginLeft: "auto"
        },
        notLastButton: {
            marginRight: theme.spacing(1)
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

    const cancel = () => {
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
                    className={css(styles.firstButton, styles.notLastButton)}
                    color="primary"
                    onClick={create}
                    startIcon={<SaveIcon />}
                    variant="contained"
                >
                    <Typography>Save</Typography>
                </Button>

                <Button
                    color="secondary"
                    onClick={cancel}
                    startIcon={<CancelIcon />}
                    variant="contained"
                >
                    <Typography>Cancel</Typography>
                </Button>
            </Box>
        </Box>
    );
};
