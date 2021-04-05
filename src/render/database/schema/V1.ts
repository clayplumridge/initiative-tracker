import { DatabaseSchema } from ".";

export const enum TableNames {}
export const enum RegistryKeys {}

export interface Schema extends DatabaseSchema {
    version: 1;
    tables: {};
    registry: {};
}
