import {
    Box,
    Button,
    ClickAwayListener,
    createStyles,
    makeStyles,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@material-ui/core";
import { Encounter } from "@/render/state/Encounter";
import * as React from "react";
import { Observer } from "@/render/components/Observer";
import { Actor, ActorType, createActor, NpcActor, PlayerActor } from "@/models";
import { IObservableValue } from "@/render/core/Observable";
import { IReadonlyObservableValue } from "@/render/core/Observable";

const encounter: Encounter = new Encounter();

encounter.addActor(
    createActor({ name: "pc", actorType: ActorType.PC, initiativeModifier: 1 })
);
encounter.addActor(
    createActor({
        name: "npc",
        actorType: ActorType.NPC,
        initiativeModifier: 2
    })
);

const useStyles = makeStyles(theme =>
    createStyles({
        startEncounterButton: {
            marginTop: "auto"
        }
    })
);

export const EncounterView: React.FC<{}> = () => {
    const styles = useStyles();

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

const PlayerRow: React.FC<{ actor: IObservableValue<PlayerActor> }> = ({
    actor
}) => {
    const { initiative, template } = actor.value;
    const name = `TODO ${template.name}`;

    return (
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{initiative}</TableCell>
        </TableRow>
    );
};

const NpcRow: React.FC<{ actor: IReadonlyObservableValue<NpcActor> }> = ({
    actor
}) => {
    const { initiative, template } = actor.value;
    const name = `TODO ${template.name}`;

    return (
        <Observer observed={{ actor }}>
            {({ actor }) => (
                <TableRow>
                    <EditableTextCell
                        onChange={val => encounter.updateActor({ ...actor })}
                        onCommit={() => true}
                        value={name}
                    />
                    <TableCell>{initiative}</TableCell>
                </TableRow>
            )}
        </Observer>
    );
};

export const EditableTextCell: React.FC<{
    onChange: (val: string) => void;
    onCommit: (val: string) => boolean;
    value: string;
}> = ({ value, onChange, onCommit }) => {
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
                {isEditable ? <div>Edit Mode YOLO</div> : value}
            </TableCell>
        </ClickAwayListener>
    );
};
