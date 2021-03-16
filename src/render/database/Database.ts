import { ActorTemplate } from "@/models";
import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Encounter, EncounterData } from "@/render/state/Encounter";
import {
    Schema,
    DbDefaults,
    RegistryKey,
    TableKey,
    TableNames,
    RegistryKeys
} from "@/render/database/Schema";

const dataFile: string = "db.json";
const adapter: AdapterSync<Schema> = new FileSync<Schema>(dataFile);
const db = low(adapter);

export class Database {
    constructor() {
        db.defaults(DbDefaults).write();

        if (db.get("version").value() < DbDefaults.version) {
            // TODO: Run migrations
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
        this.table(TableNames.encounter)
            .push({ ...encounter.encounterData })
            .write();
    }

    public updateEncounter(encounter: Encounter): void {
        this.table(TableNames.encounter)
            .find({ id: encounter.encounterData.id })
            .assign({ ...encounter.encounterData })
            .write();
    }

    public getEncounter(encounterId: string): EncounterData {
        return this.table(TableNames.encounter)
            .find({ id: encounterId })
            .value();
    }

    public getEncounters(): EncounterData[] {
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
