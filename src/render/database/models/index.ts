import { Schema } from "@/render/database/schema";
import { UnwrapArray } from "@/util";

/**
 * README
 *
 * This file is the reference / common names file for all of the latest versions of database models
 * Treat this file like the contracts between the latest DB version and the application
 */

export type ActorTemplate = UnwrapArray<Schema["tables"]["actorTemplate"]>;
export type Encounter = UnwrapArray<Schema["tables"]["encounter"]>;
export type Actor = UnwrapArray<Encounter["actors"]>;
export { ActorType, PlayerActor, NpcActor } from "@/render/database/schema";
