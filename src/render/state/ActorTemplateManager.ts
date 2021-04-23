import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import { ActorTemplate } from "@/render/database/models";
import { createSingletonGetter, PartialShallow } from "@/util";

export type Filter = PartialShallow<ActorTemplate>;

class ActorTemplateManager {
    private readonly database = getDatabaseConnection();

    public getActors(filter?: Filter): ActorTemplate[] {
        return this.database.getActorTemplates(filter);
    }
}

export const getActorTemplateManager = createSingletonGetter(
    ActorTemplateManager
);
