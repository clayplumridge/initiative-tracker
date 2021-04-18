import { DatabaseSchema, V1Schema, V2Schema } from "@/render/database/schema";
import { DbDefaults } from "@/render/database/defaults";
import { migrateToLatest } from "@/render/database/migration";

const v1Schema: V1Schema = {
    version: 1,
    tables: {},
    registry: {}
};

const v2Schema: V2Schema = {
    version: 2,
    tables: {
        actorTemplate: [],
        encounter: []
    },
    registry: {}
};

// Using this instead of Record<number, DatabaseSchema> so we can use describe.each below
const schemaMatrix: [number, DatabaseSchema][] = [
    [1, v1Schema],
    [2, v2Schema]
];
const [_, latestSchema] = schemaMatrix.find(([v]) => v == DbDefaults.version)!;

describe.each(schemaMatrix)("migration from %s", (version, schema) => {
    test(`Migration chain is valid for V${version}`, () => {
        const result = migrateToLatest(schema);
        expect(result.version).toBe(DbDefaults.version);
        expect(result).toEqual(latestSchema);
    });
});
