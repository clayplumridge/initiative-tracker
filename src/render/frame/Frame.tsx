import * as React from "react";
import {
    Box,
    createStyles,
    CssBaseline,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import { theme } from "@/render/theme";

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: "100%"
        }
    })
);

export const Frame: React.FC<{}> = ({ children }) => {
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
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};
