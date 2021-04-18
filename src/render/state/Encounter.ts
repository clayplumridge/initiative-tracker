import { v4 as uuidv4 } from "uuid";
import {
    IReadonlyObservableArray,
    IReadonlyObservableValue,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";
import { Actor, ActorTemplate } from "@/render/database/models";
import { DatabaseObject, TableNames } from "@/render/database/schema";
import { serialize } from "@/render/database/Serialize";
import { getRandomInt } from "@/util";

type DatabaseEncounter = DatabaseObject<TableNames.encounter>;

interface EncounterData {
    readonly actors: ObservableArray<ObservableValue<Actor>>;
    readonly id: string;
    readonly name: string;
}

function createActor(template: ActorTemplate): Actor {
    return {
        actorType: template.actorType,
        id: uuidv4(),
        name: template.name,
        template
    };
}

export class Encounter {
    private readonly encounterData: EncounterData;

    constructor(fromDatabase?: DatabaseEncounter) {
        if (fromDatabase) {
            this.encounterData = {
                ...fromDatabase,
                actors: new ObservableArray(
                    fromDatabase.actors.map(x => new ObservableValue(x))
                )
            };
        } else {
            this.encounterData = {
                actors: new ObservableArray<ObservableValue<Actor>>(),
                id: uuidv4(),
                name: "Unnamed Encounter"
            };
        }
    }

    public addActor(template: ActorTemplate) {
        let actor = createActor(template);

        if (!template.uniqueName) {
            const count = this.encounterData.actors.value.filter(
                ({ value }) => value.template.id == template.id
            ).length;
            actor = { ...actor, name: `${actor.template.name} ${count + 1}` };
        }

        this.encounterData.actors.push(new ObservableValue(actor));
    }

    public getActors(): IReadonlyObservableArray<
        IReadonlyObservableValue<Actor>
    > {
        return this.encounterData.actors;
    }

    public getId() {
        return this.encounterData.id;
    }

    public sortByInitiative(): void {
        this.encounterData.actors.value = [
            ...this.encounterData.actors.value
        ].sort(
            (actor1, actor2) =>
                (actor2.value.initiative || -1) -
                (actor1.value.initiative || -1)
        );
    }

    public startEncounter(forceRestart?: boolean): void {
        this.encounterData.actors.value = this.encounterData.actors.value.map(
            actor => {
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

    public toDatabaseFormat(): DatabaseEncounter {
        return serialize(this.encounterData);
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
}
