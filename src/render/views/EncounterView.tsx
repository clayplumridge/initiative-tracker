import * as React from "react";
import {
    Actor,
    ActorType,
    NpcActor,
    PlayerActor
} from "@/render/database/models";
import {
    Box,
    Button,
    ClickAwayListener,
    createStyles,
    IconButton,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField
} from "@material-ui/core";
import { Encounter } from "@/render/state/Encounter";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { IObservableValue } from "@/render/core/Observable";
import { IReadonlyObservableValue } from "@/render/core/Observable";
import { Observer } from "@/render/components";
import { Save } from "@material-ui/icons";
import { v4 as uuidv4 } from "uuid";

const useStyles = makeStyles(theme =>
    createStyles({
        startEncounterButton: {
            marginTop: "auto"
        }
    })
);

export const EncounterView: React.FC<{}> = () => {
    const encounterManager = getEncounterManager();

    return (
        <Observer
            observed={{
                encounter: encounterManager.getCurrentEncounter()
            }}
        >
            {({ encounter }) =>
                encounter ? (
                    <EncounterViewContent encounter={encounter} />
                ) : (
                    <></>
                )
            }
        </Observer>
    );
};

const EncounterViewContent: React.FC<{ encounter: Encounter }> = ({
    encounter
}) => {
    const styles = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const addPlayer = () => {
        encounter.addActor({
            actorType: ActorType.PC,
            id: uuidv4(),
            initiativeModifier: 1,
            name: "pc",
            uniqueName: true
        });
        handleClose();
    };

    const addNpc = () => {
        encounter.addActor({
            actorType: ActorType.NPC,
            id: "test-npc",
            initiativeModifier: 2,
            name: "npc",
            uniqueName: false
        });
        handleClose();
    };

    return (
        <Paper>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Initiative</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <Observer observed={{ actors: encounter.getActors() }}>
                            {({ actors }) =>
                                actors.map(actor => (
                                    <ActorRow
                                        actor={actor}
                                        encounter={encounter}
                                        key={actor.value.id}
                                    />
                                ))
                            }
                        </Observer>
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                className={styles.startEncounterButton}
                onClick={() => encounter.startEncounter()}
            >
                Start Encounter
            </Button>

            <Button
                className={styles.startEncounterButton}
                onClick={() => encounter.startEncounter(true)}
            >
                Restart Encounter
            </Button>

            <Button
                className={styles.startEncounterButton}
                onClick={() => encounter.sortByInitiative()}
            >
                Sort By Initiative
            </Button>
            <Button
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                Add Player or Monster
            </Button>
            <Menu
                keepMounted
                anchorEl={anchorEl}
                id="simple-menu"
                onClose={handleClose}
                open={Boolean(anchorEl)}
            >
                <MenuItem onClick={addPlayer}>Add Player</MenuItem>
                <MenuItem onClick={addNpc}>Add Monster</MenuItem>
                <MenuItem onClick={handleClose}>Add Freehand Monster</MenuItem>
            </Menu>
        </Paper>
    );
};

const ActorRow: React.FC<{
    actor: IObservableValue<Actor>;
    encounter: Encounter;
}> = ({ actor, encounter }) => {
    switch (actor.value.actorType) {
        case ActorType.PC:
            return <PlayerRow actor={actor as IObservableValue<PlayerActor>} />;
        case ActorType.NPC:
            return (
                <NpcRow
                    actor={actor as IObservableValue<NpcActor>}
                    encounter={encounter}
                />
            );
        default:
            return null;
    }
};

const useRowStyles = makeStyles(theme =>
    createStyles({
        row: {
            minHeight: 81
        }
    })
);

const PlayerRow: React.FC<{ actor: IObservableValue<PlayerActor> }> = ({
    actor
}) => {
    const { initiative, template } = actor.value;
    const name = `TODO ${template.name}`;

    const styles = useRowStyles();

    return (
        <TableRow className={styles.row}>
            <TableCell>{name}</TableCell>
            <TableCell>{initiative}</TableCell>
        </TableRow>
    );
};

const NpcRow: React.FC<{
    actor: IReadonlyObservableValue<NpcActor>;
    encounter: Encounter;
}> = ({ actor, encounter }) => {
    const styles = useRowStyles();

    return (
        <Observer observed={{ actor }}>
            {({ actor }) => (
                <TableRow className={styles.row}>
                    <EditableTextCell
                        label={"Name"}
                        onChange={val =>
                            encounter.updateActor({ ...actor, name: val })
                        }
                        onCommit={() => true}
                        value={actor.name}
                    />
                    <TableCell>{actor.initiative}</TableCell>
                </TableRow>
            )}
        </Observer>
    );
};

const useEditableCellStyles = makeStyles(theme =>
    createStyles({
        iconButton: {
            alignSelf: "flex-end"
        }
    })
);

export const EditableTextCell: React.FC<{
    label?: string;
    onChange: (val: string) => void;
    onCommit: (val: string) => boolean;
    value: string;
}> = ({ value, label, onChange, onCommit }) => {
    const [isEditable, setIsEditable] = React.useState(false);

    const onClickAway = () => {
        const commitResult = onCommit(value);

        if (commitResult) {
            setIsEditable(false);
        }
    };

    const onClickSave = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        const commitResult = onCommit(value);

        if (commitResult) {
            setIsEditable(false);
            event.preventDefault();
        }
    };

    const styles = useEditableCellStyles();

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <TableCell
                onClick={ev => !ev.isDefaultPrevented() && setIsEditable(true)}
            >
                {isEditable ? (
                    <Box display="flex" flexDirection="row">
                        <TextField
                            label={label}
                            onChange={ev => onChange(ev.target.value)}
                            value={value}
                        />

                        <IconButton
                            aria-label="save"
                            className={styles.iconButton}
                            onClick={onClickSave}
                        >
                            <Save />
                        </IconButton>
                    </Box>
                ) : (
                    value
                )}
            </TableCell>
        </ClickAwayListener>
    );
};
