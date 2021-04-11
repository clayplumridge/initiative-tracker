import * as React from "react";
import { Box } from "@material-ui/core";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { TextField } from "@/render/components/TextField";
import { useObservable } from "@/util";

export const CreateEncounterView: React.FC<{}> = () => {
    const encounterManager = getEncounterManager();
    const [name, setName] = useObservable("");

    const create = () => {
        encounterManager.createNewEncounter({
            name: name.value,
            actors: []
        });
    };

    return (
        <Box display="flex" flexDirection="col">
            <TextField
                label="Name"
                onChange={newValue => setName(newValue)}
                value={name}
            />
        </Box>
    );
};
