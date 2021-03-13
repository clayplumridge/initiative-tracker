import {
    Box,
    createStyles,
    CssBaseline,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import * as React from "react";
import { theme } from "@/render/theme";
import { EncounterView } from "./views/Encounter";

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: "100%"
        }
    })
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
                    <EncounterView />
                </Box>
            </Box>
        </ThemeProvider>
    );
}
