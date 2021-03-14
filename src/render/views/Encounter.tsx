import {
    Box,
    Button,
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
import { IObservableValue } from "../core/Observable";

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

const NpcRow: React.FC<{ actor: IObservableValue<NpcActor> }> = ({ actor }) => {
    const { initiative, template } = actor.value;
    const name = `TODO ${template.name}`;

    return (
        <TableRow>
            <TableCell>{name}</TableCell>
            <TableCell>{initiative}</TableCell>
        </TableRow>
    );
};
