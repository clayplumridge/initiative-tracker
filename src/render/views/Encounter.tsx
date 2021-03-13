import { Box } from "@material-ui/core";
import { Encounter } from "@/render/state/Encounter";
import * as React from "react";
import { Observer } from "@/render/components/Observer";
import { ActorType, createActor } from "@/models";

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

export const EncounterView: React.FC<{}> = () => {
    return (
        <Box display="flex" flexDirection="column" flexGrow={1} p={1}>
            <Observer observed={{ actors: encounter.getActors() }}>
                {({ actors }) => actors.map(actor => <div>{actor.id}</div>)}
            </Observer>
        </Box>
    );
};
