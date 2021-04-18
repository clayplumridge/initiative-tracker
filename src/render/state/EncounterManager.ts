import { v4 } from "uuid";
import {
    IObservableArray,
    IObservableValue,
    IReadonlyObservableArray,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import { Encounter as EncounterData } from "@/render/database/models";
import { Encounter } from "@/render/state/Encounter";
import { createSingletonGetter } from "@/util";

class EncounterManager {
    private readonly database = getDatabaseConnection();
    private readonly currentEncounter: IObservableValue<Encounter | undefined>;
    private readonly encounters: IObservableArray<EncounterData>;

    constructor() {
        const currentEncounterId = this.database.getCurrentEncounterId();

        if (currentEncounterId) {
            this.currentEncounter = new ObservableValue<Encounter | undefined>(
                this.getEncounter(currentEncounterId)
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

    private getEncounter(encounterId: string): Encounter | undefined {
        const data = this.database.getEncounter(encounterId);

        if (data) {
            const encounter: Encounter = new Encounter(data);
            return encounter;
        } else {
            return undefined;
        }
    }

    public getEncounters(): IReadonlyObservableArray<EncounterData> {
        return this.encounters;
    }

    public createNewEncounter(data: Omit<EncounterData, "id">): void {
        const fullEncounter = { ...data, id: v4() };
        this.database.createEncounter(fullEncounter);
        this.encounters.push(fullEncounter);
    }

    public deleteEncounter(encounterId: string): void {
        this.database.removeEncounter(encounterId);
        this.encounters.value = this.encounters.value.filter(
            x => x.id != encounterId
        );
    }
}

export const getEncounterManager = createSingletonGetter(EncounterManager);
