import * as React from "react";
import { CreateEncounterView } from "./views/CreateEncounterView";
import { EncounterManagementView } from "./views/EncounterManagementView";
import { EncounterView } from "@/render/views/EncounterView";
import { Frame } from "./frame/Frame";
import { getViewManager, View } from "./state/ViewManager";
import { Observer } from "@/render/components/Observer";

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
