import * as React from "react";
import { Observer } from "@/render/components";
import { Frame } from "@/render/frame/Frame";
import { getViewManager, View } from "@/render/state/ViewManager";
import {
    ActorTemplateManagementView,
    CreateActorTemplateView,
    CreateEncounterView,
    EncounterManagementView,
    EncounterView
} from "@/render/views";

export default function App() {
    const viewManager = getViewManager();

    return (
        <Frame>
            <Observer
                observed={{
                    currentView: viewManager.getCurrentView()
                }}
            >
                {({ currentView }) => {
                    const ViewComponent = ViewMap[currentView];
                    return <ViewComponent />;
                }}
            </Observer>
        </Frame>
    );
}

const ViewMap: Record<View, React.FC<{}>> = {
    [View.Encounter]: EncounterView,
    [View.EncounterManagement]: EncounterManagementView,
    [View.CreateEncounter]: CreateEncounterView,
    [View.ActorTemplateManagement]: ActorTemplateManagementView,
    [View.CreateActorTemplate]: CreateActorTemplateView
};
