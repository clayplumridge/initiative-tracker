import { Encounter, EncounterData } from "./Encounter";
import { Database } from "@/render/state/Database";

export class EncounterManager {
    private readonly database: Database;

    constructor(database: Database) {
        this.database = database;
    }

    public loadEncounter(encounterId: string): Encounter {
        const encounterData: EncounterData = this.database.getEncounter(
            encounterId
        );
        if (encounterData) {
            const encounter: Encounter = new Encounter(encounterData);
            return encounter;
        } else {
            throw "No encounter found with that identifier";
        }
    }

    public createNewEncounter(): Encounter {
        const encounter: Encounter = new Encounter();
        this.database.createEncounter(encounter);
        return encounter;
    }

    public deleteEncounter(encounterId: string): void {
        this.database.removeEncounter(encounterId);
    }
}
