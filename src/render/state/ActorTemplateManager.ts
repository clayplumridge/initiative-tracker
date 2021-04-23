import {
    IReadonlyObservableArray,
    ObservableArray
} from "@/render/core/Observable";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import { ActorTemplate } from "@/render/database/models";
import { createSingletonGetter, PartialShallow } from "@/util";

export type Filter = PartialShallow<ActorTemplate>;

class ActorTemplateManager {
    private readonly database = getDatabaseConnection();
    private readonly templates = new ObservableArray<ActorTemplate>([]);

    public delete(id: string) {
        this.database.deleteActorTemplate(id);
        this.templates.value = this.templates.value.filter(x => x.id != id);
    }

    public search(filter?: Filter): IReadonlyObservableArray<ActorTemplate> {
        this.templates.value = this.database.getActorTemplates(filter);
        return this.templates;
    }
}

export const getActorTemplateManager = createSingletonGetter(
    ActorTemplateManager
);
