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
    Save as SaveIcon,
    PersonAdd as PersonAddIcon
} from "@material-ui/icons";
import { Observer, TextField } from "@/render/components";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getViewManager, View } from "@/render/state/ViewManager";
import { css, useObservable, useObservableArray } from "@/util";
import { Actor } from "../database/models";
import { ActorType, PlayerActor } from "../database/schema/V2";
import { SpeedDial, SpeedDialAction, SpeedDialIcon } from "@material-ui/lab";

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
        },
        leftButton: {
            marginTop: theme.spacing(1),
            marginLeft: "auto"
        },
        fab: {
            bottom: theme.spacing(2),
            position: "absolute",
            right: theme.spacing(2)
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
    const speedDialActions = [
        { icon: <PersonAddIcon />, name: "Add NPC" },
        { icon: <PersonAddIcon />, name: "Add NPC From Template" },
        { icon: <PersonAddIcon />, name: "Add Player Character" },
        { icon: <PersonAddIcon />, name: "Add All Player Characters" }
    ];

    const create = () => {
        encounterManager.createNewEncounter({
            actors: [...actors.value],
            name: name.value
        });

        viewManager.onViewChanged(View.EncounterManagement);
    };

    const addPlayerCharacters = () => {
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

    const cancel = () => {
        viewManager.onViewChanged(View.EncounterManagement);
    };

    const handleSpeedDialClose = () => {
        setSpeedDialOpen(false);
    };

    const handleSpeedDialOpen = () => {
        setSpeedDialOpen(true);
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
                            className={styles.fab}
                            color="primary"
                            ariaLabel="Add Character"
                            onClick={() => console.log("hello")}
                            onOpen={handleSpeedDialOpen}
                            onClose={handleSpeedDialClose}
                            open={speedDialOpen}
                            icon={<SpeedDialIcon />}
                            direction="left"
                        >
                            {speedDialActions.map(action => (
                                <SpeedDialAction
                                    key={action.name}
                                    icon={action.icon}
                                    tooltipTitle={action.name}
                                    onClick={handleSpeedDialClose}
                                />
                            ))}
                        </SpeedDial>
                    );
                }}
            </Observer>
        </Box>
    );
};
