import * as React from "react";
import {
    Box,
    Button,
    createStyles,
    FormControlLabel,
    makeStyles,
    Typography
} from "@material-ui/core";
import { Cancel as CancelIcon, Save as SaveIcon } from "@material-ui/icons";
import { Checkbox, TextField } from "@/render/components";
import { ActorType } from "@/render/database/schema";
import { getActorTemplateManager } from "@/render/state/ActorTemplateManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { css, useObservable } from "@/util";

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

export const CreateActorTemplateView: React.FC<{}> = () => {
    const styles = useStyles();
    const [name, setName] = useObservable("");
    const [initiativeModifier, setInitiativeModifier] = useObservable("");
    const [isUniqueName, setIsUniqueName] = useObservable(false);
    const [actorType, setActorType] = useObservable(ActorType.NPC);

    const create = () => {
        getActorTemplateManager().create({
            actorType: actorType.value,
            initiativeModifier: Number(initiativeModifier.value),
            name: name.value,
            uniqueName: isUniqueName.value
        });
    };

    return (
        <Box display="flex" flexDirection="column">
            <TextField
                label="Name"
                onChange={newValue => setName(newValue)}
                value={name}
            />

            <FormControlLabel
                control={
                    <Checkbox
                        checked={isUniqueName}
                        onChange={() => setIsUniqueName(!isUniqueName.value)}
                    />
                }
                label="Is this a uniquely named character?"
            />

            <TextField
                label="Initiative Modifier"
                onChange={newValue => setInitiativeModifier(newValue)}
                type="number"
                value={initiativeModifier}
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
                    onClick={() =>
                        getViewManager().onViewChanged(
                            View.ActorTemplateManagement
                        )
                    }
                    startIcon={<CancelIcon />}
                    variant="contained"
                >
                    <Typography>Cancel</Typography>
                </Button>
            </Box>
        </Box>
    );
};
