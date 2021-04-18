import * as React from "react";
import { Frame } from "./frame/Frame";
import { getViewManager, View } from "./state/ViewManager";
import { CreateEncounterView } from "./views/CreateEncounterView";
import { EncounterManagementView } from "./views/EncounterManagementView";
import { Observer } from "@/render/components";
import { EncounterView } from "@/render/views/EncounterView";

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
    [View.CreateEncounter]: CreateEncounterView
};
