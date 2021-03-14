import { Actor } from "@/models";
import {
    IObservableArray,
    IObservableValue,
    IReadonlyObservableArray,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";
import { getRandomInt } from "@/util";
import { v4 as uuidv4 } from "uuid";

export interface EncounterData {
    readonly actors: IObservableArray<IObservableValue<Actor>>;
    readonly id: string;
}

export class Encounter {
    public readonly encounterData: EncounterData;

    constructor(encounterData?: EncounterData) {
        if (encounterData) {
            this.encounterData = encounterData;
        } else {
            this.encounterData = {
                actors: new ObservableArray<ObservableValue<Actor>>(),
                id: uuidv4()
            };
        }
    }

    public getActors(): IReadonlyObservableArray<IObservableValue<Actor>> {
        return this.encounterData.actors;
    }

    public addActor(actor: Actor) {
        if (!actor.template.uniqueName) {
            const count = this.encounterData.actors.value.filter(
                ({ value }) => value.template.id == actor.template.id
            ).length;
            actor = { ...actor, name: `${actor.template.name} ${count + 1}` };
        }

        this.encounterData.actors.push(new ObservableValue(actor));
    }

    public updateActor(actor: Actor) {
        const actorToUpdate = this.encounterData.actors.value.find(
            x => x.value.id == actor.id
        );

        if (actorToUpdate) {
            actorToUpdate.value = actor;
        } else {
            console.error("O no");
        }
    }

    public startEncounter(forceRestart?: boolean): void {
        this.encounterData.actors.value = this.encounterData.actors.value.map(
            (actor: IObservableValue<Actor>) => {
                if (forceRestart || undefined == actor.value.initiative) {
                    actor.value.initiative =
                        getRandomInt(1, 20) +
                        actor.value.template.initiativeModifier;
                }
                return actor;
            }
        );
        this.sortByInitiative();
    }

    public sortByInitiative(): void {
        this.encounterData.actors.value = [
            ...this.encounterData.actors.value
        ].sort(
            (actor1, actor2) =>
                (actor1.value.initiative || -1) -
                (actor2.value.initiative || -1)
        );
    }
}
