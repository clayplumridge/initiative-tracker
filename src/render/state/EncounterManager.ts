import { createSingletonGetter } from "@/util";
import { Encounter } from "@/render/state/Encounter";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import { IObservableValue, ObservableValue } from "@/render/core/Observable";

class EncounterManager {
    private readonly database = getDatabaseConnection();
    private readonly currentEncounter: IObservableValue<Encounter>;

    constructor() {
        const currentEncounterId = this.database.getCurrentEncounterId();
        if (currentEncounterId) {
            const currentEncounter: Encounter = this.getEncounter(
                currentEncounterId
            );
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
        const data = this.database.getEncounter(encounterId);

        if (data) {
            const encounter: Encounter = new Encounter(data);
            return encounter;
        } else {
            throw "No encounter found with that identifier";
        }
    }

    public getEncounters(): Map<String, String> {
        const encounters: Map<String, String> = new Map<String, String>();
        this.database
            .getEncounters()
            .map(encounter => encounters.set(encounter.name, encounter.id));

        return encounters;
    }

    public createNewEncounter(): Encounter {
        const encounter: Encounter = new Encounter();
        this.database.createEncounter(encounter.toDatabaseFormat());
        this.database.setCurrentEncounterId(encounter.getId());
        return encounter;
    }

    public deleteEncounter(encounterId: string): void {
        this.database.removeEncounter(encounterId);
    }
}

export const getEncounterManager = createSingletonGetter(EncounterManager);
