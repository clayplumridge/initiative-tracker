import { DatabaseSchema, V1Schema } from ".";
import { Migration } from "../migration";

export const enum TableNames {
    actorTemplate = "actorTemplate",
    encounter = "encounter"
}

export const enum RegistryKeys {
    currentEncounterId = "currentEncounterId"
}

export interface Schema extends DatabaseSchema {
    version: 2;
    tables: {
        [TableNames.actorTemplate]: ActorTemplate[];
        [TableNames.encounter]: Encounter[];
    };
    registry: {
        [RegistryKeys.currentEncounterId]?: string;
    };
}

export const enum ActorType {
    PC = 1,
    NPC = 2
}

interface ActorTemplate {
    actorType: ActorType;
    id: string;
    initiativeModifier: number;
    name: string;
    uniqueName: boolean;
}

interface Encounter {
    readonly actors: Actor[];
    readonly id: string;
    readonly name: string;
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

type Actor = PlayerActor | NpcActor;

export const FromV1: Migration<V1Schema, Schema> = {
    oldVersion: 1,
    newVersion: 2,
    apply: v1 => {
        const result: Schema = {
            version: 2,
            tables: {
                ...v1.tables,
                actorTemplate: [],
                encounter: []
            },
            registry: {
                ...v1.registry
            }
        };

        return result;
    }
};
