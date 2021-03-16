import { Encounter, EncounterData } from "@/render/state/Encounter";
import { Database } from "@/render/database/Database";
import { IObservableValue, ObservableValue } from "@/render/core/Observable";

export class EncounterManager {
    private readonly database: Database;

    private readonly currentEncounter: IObservableValue<Encounter>;

    constructor(database: Database) {
        this.database = database;
        const currentEncounterId: string = this.database.getCurrentEncounterId();
        if (currentEncounterId) {
            const currentEncounter: Encounter = this.getEncounter(
                currentEncounterId
            );
            console.log(currentEncounter);
            this.currentEncounter = new ObservableValue<Encounter>(
                currentEncounter
            );
        } else {
            this.currentEncounter = new ObservableValue<Encounter>(
                this.createNewEncounter()
            );
        }
    }

    public loadEncounter(encounterId: string): void {
        this.currentEncounter.value = this.getEncounter(encounterId);
        this.database.setCurrentEncounterId(encounterId);
    }

    public getCurrentEncounter(): IObservableValue<Encounter> {
        return this.currentEncounter;
    }

    private getEncounter(encounterId: string): Encounter {
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

    public getEncounters(): Map<String, String> {
        const encounters: Map<String, String> = new Map<String, String>();
        this.database
            .getEncounters()
            .map((encounter: EncounterData) =>
                encounters.set(encounter.name, encounter.id)
            );
        return encounters;
    }

    public createNewEncounter(): Encounter {
        const encounter: Encounter = new Encounter();
        this.database.createEncounter(encounter);
        this.database.setCurrentEncounterId(encounter.encounterData.id);
        return encounter;
    }

    public deleteEncounter(encounterId: string): void {
        this.database.removeEncounter(encounterId);
    }
}
