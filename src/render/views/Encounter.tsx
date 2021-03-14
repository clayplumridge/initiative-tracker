import {
    Box,
    Button,
    ClickAwayListener,
    createStyles,
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
    TextField,
    Typography
} from "@material-ui/core";
import { Encounter } from "@/render/state/Encounter";
import * as React from "react";
import { Observer } from "@/render/components/Observer";
import { Actor, ActorType, createActor, NpcActor, PlayerActor } from "@/models";
import { IObservableValue } from "@/render/core/Observable";
import { IReadonlyObservableValue } from "@/render/core/Observable";

const encounter: Encounter = new Encounter();

const useStyles = makeStyles(theme =>
    createStyles({
        startEncounterButton: {
            marginTop: "auto"
        }
    })
);

export const EncounterView: React.FC<{}> = () => {
    const styles = useStyles();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const addPlayer = () => {
        encounter.addActor(
            createActor({
                name: "pc",
                actorType: ActorType.PC,
                initiativeModifier: 1,
                id: 0,
                uniqueName: true
            })
        );
        handleClose();
    };

    const addNpc = () => {
        encounter.addActor(
            createActor({
                name: "npc",
                actorType: ActorType.NPC,
                initiativeModifier: 2,
                id: 1,
                uniqueName: false
            })
        );
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
                                actors.map(actor => <ActorRow actor={actor} />)
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
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={addPlayer}>Add Player</MenuItem>
                <MenuItem onClick={addNpc}>Add Monster</MenuItem>
                <MenuItem onClick={handleClose}>Add Freehand Monster</MenuItem>
            </Menu>
        </Paper>
    );
};

const ActorRow: React.FC<{ actor: IObservableValue<Actor> }> = ({ actor }) => {
    switch (actor.value.actorType) {
        case ActorType.PC:
            return <PlayerRow actor={actor as IObservableValue<PlayerActor>} />;
        case ActorType.NPC:
            return <NpcRow actor={actor as IObservableValue<NpcActor>} />;
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

const NpcRow: React.FC<{ actor: IReadonlyObservableValue<NpcActor> }> = ({
    actor
}) => {
    const styles = useRowStyles();

    return (
        <Observer observed={{ actorInt: actor }}>
            {({ actorInt }) => (
                <TableRow className={styles.row}>
                    <EditableTextCell
                        label={"Name"}
                        onChange={val =>
                            encounter.updateActor({ ...actorInt, name: val })
                        }
                        onCommit={() => true}
                        value={actorInt.name}
                    />
                    <TableCell>{actorInt.initiative}</TableCell>
                </TableRow>
            )}
        </Observer>
    );
};

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

    return (
        <ClickAwayListener onClickAway={onClickAway}>
            <TableCell onClick={() => setIsEditable(true)}>
                {isEditable ? (
                    <TextField
                        label={label}
                        onChange={ev => {
                            console.log(ev.target.value);
                            onChange(ev.target.value);
                        }}
                        value={value}
                    />
                ) : (
                    value
                )}
            </TableCell>
        </ClickAwayListener>
    );
};
