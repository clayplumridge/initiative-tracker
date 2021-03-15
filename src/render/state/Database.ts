import { ActorTemplate } from "@/models";
import low, { AdapterSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Encounter, EncounterData } from "@/render/state/Encounter";

const dataFile: string = "db.json";
const adapter: AdapterSync<Schema> = new FileSync<Schema>(dataFile);
const db = low(adapter);

interface Schema {
    actorTemplates: Array<ActorTemplate>;
    encounters: Array<EncounterData>;
}

export class Database {
    constructor() {
        db.defaults({ actorTemplates: [], encounters: [] }).write();
    }

    public createEncounter(encounter: Encounter): void {
        db.get("encounters")
            .push({ ...encounter.encounterData })
            .write();
    }

    public updateEncounter(encounter: Encounter): void {
        db.get("encounters")
            .find({ id: encounter.encounterData.id })
            .assign({ ...encounter.encounterData })
            .write();
    }

    public getEncounter(encounterId: string): EncounterData {
        return db.get("encounters").find({ id: encounterId }).value();
    }

    public getEncounters(): EncounterData[] {
        return db.get("encounters").value();
    }

    public removeEncounter(encounterId: string): void {
        db.get("encounters").remove({ id: encounterId }).write();
    }

    public addActorTemplate(actorTemplate: ActorTemplate): void {
        db.get("actorTemplates")
            .push({ ...actorTemplate })
            .write();
    }

    public updateActorTemplate(actorTemplate: ActorTemplate): void {
        db.get("actorTemplates")
            .find({ id: actorTemplate.id })
            .assign({ ...actorTemplate })
            .write();
    }

    public getActorTemplate(actorTemplateId: string): ActorTemplate {
        return db.get("actorTemplates").find({ id: actorTemplateId }).value();
    }

    public getActorTemplates(): ActorTemplate[] {
        return db.get("actorTemplates").value();
    }
}
