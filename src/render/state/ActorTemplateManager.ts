import { ActorTemplate } from "@/render/database/models";
import { createSingletonGetter } from "@/util";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";

class ActorTemplateManager {
    private readonly database = getDatabaseConnection();

    public addActorTemplate(actorTemplate: ActorTemplate): void {
        this.database.addActorTemplate(actorTemplate);
    }

    public updateActorTemplate(actorTemplate: ActorTemplate): void {
        this.database.updateActorTemplate(actorTemplate);
    }

    public getActorTemplate(actorTemplateId: string): ActorTemplate {
        return this.database.getActorTemplate(actorTemplateId);
    }

    public getActorTemplates(): Map<String, String> {
        const actorTemplates: Map<String, String> = new Map<String, String>();
        this.database
            .getActorTemplates()
            .map((actorTemplate: ActorTemplate) =>
                actorTemplates.set(actorTemplate.name, actorTemplate.id)
            );
        return actorTemplates;
    }
}

export const getActorTemplateManager = createSingletonGetter(
    ActorTemplateManager
);
