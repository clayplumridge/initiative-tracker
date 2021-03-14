import { Actor } from "@/models";
import {
    IObservableArray,
    IObservableValue,
    IReadonlyObservableArray,
    ObservableArray,
    ObservableValue
} from "@/render/core/Observable";
import { getRandomInt } from "@/util";

export class Encounter {
    private readonly actors: IObservableArray<
        IObservableValue<Actor>
    > = new ObservableArray<ObservableValue<Actor>>();

    constructor() {}

    public getActors(): IReadonlyObservableArray<IObservableValue<Actor>> {
        return this.actors;
    }

    public addActor(actor: Actor) {
        if (!actor.template.uniqueName) {
            const count = this.actors.value.filter(
                ({ value }) => value.template.id == actor.template.id
            ).length;
            actor = { ...actor, name: `${actor.template.name} ${count + 1}` };
        }

        this.actors.push(new ObservableValue(actor));
    }

    public updateActor(actor: Actor) {
        const actorToUpdate = this.actors.value.find(
            x => x.value.id == actor.id
        );

        if (actorToUpdate) {
            actorToUpdate.value = actor;
        } else {
            console.error("O no");
        }
    }

    public startEncounter(forceRestart?: boolean): void {
        this.actors.value = this.actors.value.map(
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
        this.actors.value = [...this.actors.value].sort(
            (actor1, actor2) =>
                (actor1.value.initiative || -1) -
                (actor2.value.initiative || -1)
        );
    }
}
