import { RegistryKeys, Schema, TableNames } from "@/render/database/schema";

export const DbDefaults: Schema = {
    version: 2,
    tables: {
        [TableNames.actorTemplate]: [],
        [TableNames.encounter]: []
    },
    registry: {
        [RegistryKeys.currentEncounterId]: undefined
    }
};
