import * as React from "react";
import { Add as AddIcon, People as PeopleIcon } from "@material-ui/icons";
import {
    Box,
    createStyles,
    CssBaseline,
    Drawer,
    Hidden,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    ThemeProvider
} from "@material-ui/core";
import { getViewManager, View } from "@/render/state/ViewManager";
import { IReadonlyObservableValue } from "@/render/core/Observable";
import { Observer } from "@/render/components/Observer";
import { theme } from "@/render/theme";
import { useObservable } from "@/util";

const useStyles = makeStyles(theme =>
    createStyles({
        root: {
            height: "100%"
        }
    })
);

interface DrawerItemProps {
    id: View;
    icon: React.FC<{}>;
    text: string;
}

const DrawerItems: DrawerItemProps[] = [
    {
        id: View.Encounter,
        icon: PeopleIcon,
        text: "Current Encounter"
    },
    {
        id: View.EncounterManagement,
        icon: AddIcon,
        text: "Encounters"
    }
];

export const Frame: React.FC<{}> = ({ children }) => {
    const viewManager = getViewManager();
    const styles = useStyles();
    const [mobileIsOpen, setMobileIsOpen] = useObservable(false);

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.root} display="flex">
                <CssBaseline />

                <ResponsiveDrawer
                    mobileOpen={mobileIsOpen}
                    mobileOnClose={() => setMobileIsOpen(!mobileIsOpen.value)}
                >
                    <List>
                        {DrawerItems.map(props => {
                            const { id, icon: Icon, text } = props;
                            return (
                                <ListItem
                                    button
                                    key={id}
                                    onClick={() =>
                                        viewManager.onViewChanged(id)
                                    }
                                >
                                    <ListItemIcon>
                                        <Icon />
                                    </ListItemIcon>

                                    <ListItemText primary={text} />
                                </ListItem>
                            );
                        })}
                    </List>
                </ResponsiveDrawer>

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

const drawerWidth = 240;

const useDrawerStyles = makeStyles(theme =>
    createStyles({
        drawer: {
            [theme.breakpoints.up("sm")]: {
                width: drawerWidth,
                flexShrink: 0
            }
        },
        drawerPaper: {
            width: drawerWidth
        }
    })
);

const ResponsiveDrawer: React.FC<{
    mobileOpen: IReadonlyObservableValue<boolean>;
    mobileOnClose: () => void;
}> = ({ children, mobileOpen: open, mobileOnClose: onClose }) => {
    const styles = useDrawerStyles();

    return (
        <nav className={styles.drawer}>
            <Hidden smUp implementation="css">
                <Observer observed={{ open }}>
                    {({ open }) => (
                        <Drawer
                            variant="temporary"
                            anchor="left"
                            open={open}
                            onClose={onClose}
                            classes={{
                                paper: styles.drawerPaper
                            }}
                            ModalProps={{
                                keepMounted: true // Better open performance on mobile
                            }}
                        >
                            {children}
                        </Drawer>
                    )}
                </Observer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    variant="permanent"
                    classes={{
                        paper: styles.drawerPaper
                    }}
                    open
                >
                    {children}
                </Drawer>
            </Hidden>
        </nav>
    );
};