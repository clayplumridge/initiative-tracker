import * as React from "react";
import {
    Box,
    Button,
    createStyles,
    makeStyles,
    Typography
} from "@material-ui/core";
import {
    Cancel as CancelIcon,
    PersonAdd as PersonAddIcon,
    Save as SaveIcon
} from "@material-ui/icons";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";
import { Observer, TextField } from "@/render/components";
import { Actor } from "@/render/database/models";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { css, useObservable, useObservableArray } from "@/util";

const useStyles = makeStyles(theme =>
    createStyles({
        buttonRow: {
            marginTop: theme.spacing(1)
        },
        fab: {
            bottom: theme.spacing(2),
            position: "absolute",
            right: theme.spacing(2)
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
    const [actors, setActors] = useObservableArray<Actor>([]);
    const [speedDialOpen, setSpeedDialOpen] = useObservable(false);
    const styles = useStyles();
    const speedDialActions = React.useMemo(
        () => [
            {
                icon: <PersonAddIcon />,
                name: "Add NPC",
                onClick: () => addNonPlayerCharacter()
            },
            {
                icon: <PersonAddIcon />,
                name: "Add NPC From Template",
                onClick: () => addNonPlayerCharacterFromTemplate()
            },
            {
                icon: <PersonAddIcon />,
                name: "Add Player Character",
                onClick: () => addPlayerCharacter()
            },
            {
                icon: <PersonAddIcon />,
                name: "Add All Player Characters",
                onClick: () => addPlayerCharacters()
            }
        ],
        undefined
    );

    const create = () => {
        encounterManager.createNewEncounter({
            actors: [...actors.value],
            name: name.value
        });

        viewManager.onViewChanged(View.EncounterManagement);
    };

    const addPlayerCharacters = () => {
        setSpeedDialOpen(false);
        // setActors([
        //     {
        //         actorType: ActorType.PC,
        //         id: "myId",
        //         initiative: 12,
        //         name: "plinko",
        //         template: {}
        //     }
        // ]);
        //actors.concat(db.getActors(playercharacters));
    };
    const addPlayerCharacter = () => {
        // open selector for player character
        setSpeedDialOpen(false);
    };

    const addNonPlayerCharacterFromTemplate = () => {
        // open selector for NPC template
        setSpeedDialOpen(false);
    };

    const addNonPlayerCharacter = () => {
        setSpeedDialOpen(false);
        // Create NPC Screen?
    };

    const cancel = () => {
        viewManager.onViewChanged(View.EncounterManagement);
    };

    return (
        <Box display="flex" flexDirection="column">
            <TextField
                label="Encounter Name"
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
            <Observer observed={{ speedDialOpen }}>
                {({ speedDialOpen }) => {
                    return (
                        <SpeedDial
                            ariaLabel="Add Character"
                            className={styles.fab}
                            color="primary"
                            direction="left"
                            icon={<SpeedDialIcon />}
                            onClose={() => {
                                setSpeedDialOpen(false);
                            }}
                            onOpen={() => {
                                setSpeedDialOpen(true);
                            }}
                            open={speedDialOpen}
                        >
                            {speedDialActions.map(speedDialAction => (
                                <SpeedDialAction
                                    icon={speedDialAction.icon}
                                    key={speedDialAction.name}
                                    onClick={speedDialAction.onClick}
                                    tooltipTitle={speedDialAction.name}
                                />
                            ))}
                        </SpeedDial>
                    );
                }}
            </Observer>
        </Box>
    );
};
