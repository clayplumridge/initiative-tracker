import {
    Box,
    createStyles,
    CssBaseline,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import * as React from "react";
import { theme } from "@/render/theme";
import { EncounterView } from "./views/EncounterView";
import { Database } from "@/render/state/Database";
import { EncounterManager } from "@/render/state/EncounterManager";
import { ActorTemplateManager } from "./state/ActorTemplateManager";

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: "100%"
        }
    })
);

const database: Database = new Database();

const encounterManager: EncounterManager = new EncounterManager(database);

const actorTemplateManager: ActorTemplateManager = new ActorTemplateManager(
    database
);

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
                    <EncounterView
                        encounter={encounterManager.createNewEncounter()}
                    />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
