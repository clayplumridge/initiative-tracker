import {
    Box,
    createStyles,
    CssBaseline,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import * as React from "react";
import { theme } from "@/render/theme";
import { EncounterView } from "@/render/views/EncounterView";
import { getEncounterManager } from "@/render/state/EncounterManager";
import { getActorTemplateManager } from "@/render/state/ActorTemplateManager";
import { Observer } from "@/render/components/Observer";

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: "100%"
        }
    })
);

const encounterManager = getEncounterManager();
const actorTemplateManager = getActorTemplateManager();

export default function App() {
    const styles = useStyles();

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.root} display="flex">
                <CssBaseline />

                <Box
                    component="main"
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    p={1}
                >
                    <Observer
                        observed={{
                            encounter: encounterManager.getCurrentEncounter()
                        }}
                    >
                        {({ encounter }) => (
                            <EncounterView encounter={encounter} />
                        )}
                    </Observer>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
