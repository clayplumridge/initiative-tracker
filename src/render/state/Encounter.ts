import { Actor } from "@/models";
import {
    IObservableArray,
    IReadonlyObservableArray,
    ObservableArray
} from "@/render/core/Observable";
import { getRandomInt } from "@/util";

export class Encounter {
    private readonly actors: IObservableArray<Actor> = new ObservableArray<Actor>();

    constructor() {}

    public getActors(): IReadonlyObservableArray<Actor> {
        return this.actors;
    }

    public addActor(actor: Actor) {
        this.actors.push(actor);
    }

    public startEncounter(forceRestart?: boolean): void {
        this.actors.value = this.actors.value.map((actor: Actor) => {
            if (forceRestart || undefined == actor.initiative) {
                actor.initiative =
                    getRandomInt(1, 20) + actor.template.initiativeModifier;
            }
            return actor;
        });
    }
}
