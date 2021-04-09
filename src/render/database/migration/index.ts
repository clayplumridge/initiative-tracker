import { DatabaseSchema, Schema as LatestSchema } from "../schema";
import { DbDefaults } from "../defaults";
import { FromV1 as V1toV2 } from "../schema/V2";

export interface Migration<
    OldSchema extends DatabaseSchema,
    NewSchema extends DatabaseSchema
> {
    apply: (old: OldSchema) => NewSchema;
    oldVersion: OldSchema["version"];
    newVersion: NewSchema["version"];
}

const migrationList: Migration<any, any>[] = [V1toV2];

export function migrateToLatest<Old extends DatabaseSchema>(
    oldDatabase: Old
): LatestSchema {
    return migrateTo<Old, LatestSchema>(oldDatabase, DbDefaults.version);
}

export function migrateTo<
    Old extends DatabaseSchema,
    New extends DatabaseSchema
>(oldDatabase: Old, newVersion: New["version"]) {
    const targetVersion = newVersion;
    let currentDatabase: DatabaseSchema = { ...oldDatabase };

    while (currentDatabase.version != targetVersion) {
        const migration = selectMigration(currentDatabase);

        if (!migration) {
            throw new Error(
                `Found no forward migrations from version ${currentDatabase.version} - target version ${targetVersion}`
            );
        } else {
            currentDatabase = runMigration(migration, currentDatabase);
        }
    }

    return currentDatabase as New;
}

function selectMigration<Old extends DatabaseSchema>(
    oldDatabase: Old
): Migration<Old, DatabaseSchema> | undefined {
    return migrationList
        .filter(x => x.oldVersion == oldDatabase.version)
        .sort((a, b) => b.newVersion - a.newVersion)[0];
}

function runMigration<Old extends DatabaseSchema, New extends DatabaseSchema>(
    migration: Migration<Old, New>,
    oldDatabase: Old
): New {
    if (oldDatabase.version != migration.oldVersion) {
        throw new Error(
            `Invalid migration configuration: DB version is ${oldDatabase.version} and migration version is ${migration.oldVersion}`
        );
    }

    return migration.apply(oldDatabase);
}
