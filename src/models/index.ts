import { match } from "ts-pattern";
import { v4 } from "uuid";

export interface ActorTemplate {
    actorType: ActorType;
    id: string;
    initiativeModifier: number;
    name: string;
    uniqueName: boolean;
}

export const enum ActorType {
    NPC = 2,
    PC = 1
}

interface ActorBase {
    actorType: ActorType;
    id: string;
    initiative?: number;
    name: string;
    template: ActorTemplate;
}

export interface NpcActor extends ActorBase {
    actorType: ActorType.NPC;
}

export interface PlayerActor extends ActorBase {
    actorType: ActorType.PC;
}

export type Actor = PlayerActor | NpcActor;

export function createActor(template: ActorTemplate): Actor {
    return match(template)
        .with({ actorType: ActorType.NPC }, res => createNpc(res))
        .with({ actorType: ActorType.PC }, res => createPc(res))
        .run();
}

function createNpc(template: ActorTemplate): Actor {
    return {
        actorType: template.actorType,
        id: v4(),
        name: template.name,
        template: template
    };
}

function createPc(template: ActorTemplate): Actor {
    return {
        actorType: template.actorType,
        id: v4(),
        name: template.name,
        template: template
    };
}
