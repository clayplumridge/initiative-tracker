import * as React from "react";
import { Box } from "@material-ui/core";
import { getEncounterManager } from "@/render/state/EncounterManager";

export const CreateEncounterView: React.FC<{}> = () => {
    const encounterManager = getEncounterManager();

    return <Box display="flex" flexDirection="col"></Box>;
};
