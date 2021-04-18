import { RegistryKeys, Schema, TableNames } from "@/render/database/schema";

export const DbDefaults: Schema = {
    registry: {
        [RegistryKeys.currentEncounterId]: undefined
    },
    tables: {
        [TableNames.actorTemplate]: [],
        [TableNames.encounter]: []
    },
    version: 2
};
