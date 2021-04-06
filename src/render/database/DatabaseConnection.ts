import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import {
    Schema,
    TableNames,
    RegistryKeys,
    DatabaseObject,
    DatabaseSchema
} from "@/render/database/schema";
import { DbDefaults } from "./defaults";
import { createSingletonGetter } from "@/util";
import { migrateToLatest } from "./migration";

type TableKey = keyof Schema["tables"];
type RegistryKey = keyof Schema["registry"];

type ActorTemplate = DatabaseObject<TableNames.actorTemplate>;
type Encounter = DatabaseObject<TableNames.encounter>;

const dataFile: string = "db.json";
const adapter: AdapterSync<Schema> = new FileSync<Schema>(dataFile);
const db = low(adapter);

class DatabaseConnection {
    constructor() {
        db.defaults(DbDefaults).write();

        if (db.get("version").value() < DbDefaults.version) {
            // Read the entire DB and migrate, then write it back out
            // Seems like not a great paradigm, but I need to wrangle the type system more first
            const old = db.value() as DatabaseSchema;
            const afterMigration = migrateToLatest(old);
            db.assign({ ...afterMigration }).write();
        }
    }

    private tables() {
        return db.get("tables");
    }

    private table<T extends TableKey>(table: T) {
        return this.tables().get(table);
    }

    private registry() {
        return db.get("registry");
    }

    private registryValue<T extends RegistryKey>(registryKey: T) {
        return this.registry().get(registryKey);
    }

    public createEncounter(encounter: Encounter): void {
        this.table(TableNames.encounter).push(encounter).write();
    }

    public updateEncounter(encounter: Encounter): void {
        this.table(TableNames.encounter)
            .find({ id: encounter.id })
            .assign({ ...encounter })
            .write();
    }

    public getEncounter(encounterId: string): Encounter | undefined {
        return this.table(TableNames.encounter)
            .find({ id: encounterId })
            .value();
    }

    public getEncounters(): Encounter[] {
        return this.table(TableNames.encounter).value();
    }

    public removeEncounter(encounterId: string): void {
        this.table(TableNames.encounter).remove({ id: encounterId }).write();
    }

    public addActorTemplate(actorTemplate: ActorTemplate): void {
        this.table(TableNames.actorTemplate)
            .push({ ...actorTemplate })
            .write();
    }

    public updateActorTemplate(actorTemplate: ActorTemplate): void {
        this.table(TableNames.actorTemplate)
            .find({ id: actorTemplate.id })
            .assign({ ...actorTemplate })
            .write();
    }

    public getActorTemplate(actorTemplateId: string): ActorTemplate {
        return this.table(TableNames.actorTemplate)
            .find({ id: actorTemplateId })
            .value();
    }

    public getActorTemplates(): ActorTemplate[] {
        return this.table(TableNames.actorTemplate).value();
    }

    public getCurrentEncounterId(): string {
        return this.registryValue(RegistryKeys.currentEncounterId).value();
    }

    public setCurrentEncounterId(encounterId: string): void {
        this.registry()
            .set(RegistryKeys.currentEncounterId, encounterId)
            .write();
    }
}

export const getDatabaseConnection = createSingletonGetter(DatabaseConnection);
