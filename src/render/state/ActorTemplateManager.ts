import { ActorTemplate } from "@/models";
import { v4 as uuidv4 } from "uuid";

export class ActorTemplateManager {
    private readonly actorTemplates: Map<String, ActorTemplate> = new Map<
        String,
        ActorTemplate
    >();

    public addActorTemplate(actorTemplate: ActorTemplate): void {
        this.actorTemplates.set(uuidv4(), actorTemplate);
    }
}
