/* eslint-disable import/order */
import { UnwrapArray } from "@/util";

export interface DatabaseSchema {
    version: number;
    tables: Record<string, any>;
    registry: Record<string, any>;
}

/** Latest -- V2 */
export {
    Schema,
    TableNames,
    RegistryKeys,
    ActorType,
    PlayerActor,
    NpcActor
} from "./V2";

type VersionedDatabaseObject<
    SchemaVersion extends DatabaseSchema,
    TableName extends keyof SchemaVersion["tables"]
> = UnwrapArray<SchemaVersion["tables"][TableName]>;

export type DatabaseObject<
    TableName extends V2TableNames
> = VersionedDatabaseObject<V2Schema, TableName>;

/** V2 */
import {
    RegistryKeys as V2RegistryKeys,
    Schema as V2Schema,
    TableNames as V2TableNames
} from "./V2";

export { V2Schema, V2TableNames, V2RegistryKeys };

/** V1 */
export {
    Schema as V1Schema,
    TableNames as V1TableNames,
    RegistryKeys as V1RegistryKeys
} from "./V1";
