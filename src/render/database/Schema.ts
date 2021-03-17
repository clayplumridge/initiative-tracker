import { ActorTemplate } from "@/models";
import { EncounterData } from "@/render/state/Encounter";
import { Serializable } from "./Serialize";

export const enum TableNames {
    actorTemplate = "actorTemplate",
    encounter = "encounter"
}

export const enum RegistryKeys {
    currentEncounterId = "currentEncounterId"
}

export type TableKey = keyof Schema["tables"];
export type RegistryKey = keyof Schema["registry"];

type UnwrapArray<T> = T extends Array<infer U> ? U : never;
export type TableType<T extends TableKey> = UnwrapArray<Schema["tables"][T]>;

export interface Schema {
    version: number;
    tables: {
        [TableNames.actorTemplate]: Serializable<ActorTemplate>[];
        [TableNames.encounter]: Serializable<EncounterData>[];
    };
    registry: {
        [RegistryKeys.currentEncounterId]?: string;
    };
}

export const DbDefaults: Schema = {
    version: 1,
    tables: {
        [TableNames.actorTemplate]: [],
        [TableNames.encounter]: []
    },
    registry: {
        [RegistryKeys.currentEncounterId]: undefined
    }
};
