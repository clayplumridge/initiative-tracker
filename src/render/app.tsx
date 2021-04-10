import * as React from "react";
import { EncounterView } from "@/render/views/EncounterView";
import { Frame } from "./frame/Frame";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { Observer } from "@/render/components/Observer";

const encounterManager = getEncounterManager();

export default function App() {
    return (
        <Frame>
            <Observer
                observed={{
                    encounter: encounterManager.getCurrentEncounter()
                }}
            >
                {({ encounter }) => <EncounterView encounter={encounter} />}
            </Observer>
        </Frame>
    );
}
