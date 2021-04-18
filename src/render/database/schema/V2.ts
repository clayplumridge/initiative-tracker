import { DatabaseSchema, V1Schema } from ".";
import { Migration } from "@/render/database/migration";

export const enum TableNames {
    actorTemplate = "actorTemplate",
    encounter = "encounter"
}

export const enum RegistryKeys {
    currentEncounterId = "currentEncounterId",
    lastViewId = "lastViewId"
}

export interface Schema extends DatabaseSchema {
    version: 2;
    tables: {
        [TableNames.actorTemplate]: ActorTemplate[];
        [TableNames.encounter]: Encounter[];
    };
    registry: {
        [RegistryKeys.currentEncounterId]?: string;
        [RegistryKeys.lastViewId]?: number;
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
    apply: v1 => {
        const result: Schema = {
            registry: {
                ...v1.registry
            },
            tables: {
                ...v1.tables,
                actorTemplate: [],
                encounter: []
            },
            version: 2
        };

        return result;
    },
    newVersion: 2,
    oldVersion: 1
};
