import { createSingletonGetter } from "@/util";
import { Encounter } from "@/render/state/Encounter";
import { Encounter as EncounterData } from "@/render/database/models";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import {
    IObservableArray,
    IObservableValue,
    IReadonlyObservableArray,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";
import { v4 } from "uuid";

class EncounterManager {
    private readonly database = getDatabaseConnection();
    private readonly currentEncounter: IObservableValue<Encounter | undefined>;
    private readonly encounters: IObservableArray<EncounterData>;

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
            this.currentEncounter = new ObservableValue(undefined);
        }

        this.encounters = new ObservableArray(this.database.getEncounters());
    }

    public loadEncounter(encounterId: string): void {
        this.currentEncounter.value = this.getEncounter(encounterId);
        this.database.setCurrentEncounterId(encounterId);
    }

    public getCurrentEncounter(): IObservableValue<Encounter | undefined> {
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

    public getEncounters(): IReadonlyObservableArray<EncounterData> {
        return this.encounters;
    }

    public createNewEncounter(data: Omit<EncounterData, "id">): Encounter {
        const fullEncounter = { ...data, id: v4() };
        this.database.createEncounter(fullEncounter);
        return new Encounter(fullEncounter);
    }

    public deleteEncounter(encounterId: string): void {
        this.database.removeEncounter(encounterId);
    }
}

export const getEncounterManager = createSingletonGetter(EncounterManager);
