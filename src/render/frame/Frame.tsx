import * as React from "react";
import {
    Add as AddIcon,
    Menu as MenuIcon,
    People as PeopleIcon
} from "@material-ui/icons";
import {
    AppBar,
    Box,
    createStyles,
    CssBaseline,
    Drawer,
    Hidden,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    ThemeProvider,
    Toolbar
} from "@material-ui/core";
import { getViewManager, View } from "@/render/state/ViewManager";
import { IReadonlyObservableValue } from "@/render/core/Observable";
import { Observer } from "@/render/components";
import { theme } from "@/render/theme";
import { useObservable } from "@/util";

const drawerWidth = 240;
const useStyles = makeStyles(theme =>
    createStyles({
        appbar: {
            [theme.breakpoints.up("sm")]: {
                marginLeft: drawerWidth,
                width: `calc(100% - ${drawerWidth}px)`
            }
        },
        root: {
            height: "100%"
        },
        // necessary for content to be below app bar
        toolbar: theme.mixins.toolbar
    })
);

interface DrawerItemProps {
    id: View;
    icon: React.FC<{}>;
    text: string;
}

/**
 * Rendering props for the ListItems inside the Drawer
 */
const DrawerItems: DrawerItemProps[] = [
    {
        icon: PeopleIcon,
        id: View.Encounter,
        text: "Current Encounter"
    },
    {
        icon: AddIcon,
        id: View.EncounterManagement,
        text: "Encounters"
    }
];

/**
 * Used to override the Nav Drawer's current Selected Item for subviews
 * Eg: CreateEncounter doesn't exist in the sidebar, so we want to show EncounterManagement as being selected instead
 */
const SelectedItemMap: Partial<Record<View, View>> = {
    [View.CreateEncounter]: View.EncounterManagement
};

export const Frame: React.FC<{}> = ({ children }) => {
    const viewManager = getViewManager();
    const styles = useStyles();
    const [mobileIsOpen, setMobileIsOpen] = useObservable(false);

    return (
        <ThemeProvider theme={theme}>
            <Box className={styles.root} display="flex">
                <CssBaseline />

                <AppBar className={styles.appbar} position="fixed">
                    <Toolbar>
                        <Hidden smUp implementation="css">
                            <IconButton
                                onClick={() =>
                                    setMobileIsOpen(!mobileIsOpen.value)
                                }
                            >
                                <MenuIcon />
                            </IconButton>
                        </Hidden>
                    </Toolbar>
                </AppBar>

                <ResponsiveDrawer
                    mobileOnClose={() => setMobileIsOpen(!mobileIsOpen.value)}
                    mobileOpen={mobileIsOpen}
                >
                    <Observer
                        observed={{
                            selectedView: viewManager.getCurrentView()
                        }}
                    >
                        {({ selectedView }) => (
                            <List>
                                {DrawerItems.map(props => {
                                    const { id, icon: Icon, text } = props;
                                    const selectedCheckId =
                                        SelectedItemMap[selectedView] ||
                                        selectedView;

                                    return (
                                        <ListItem
                                            button
                                            key={id}
                                            onClick={() =>
                                                viewManager.onViewChanged(id)
                                            }
                                            selected={id == selectedCheckId}
                                        >
                                            <ListItemIcon>
                                                <Icon />
                                            </ListItemIcon>

                                            <ListItemText primary={text} />
                                        </ListItem>
                                    );
                                })}
                            </List>
                        )}
                    </Observer>
                </ResponsiveDrawer>

                <Box
                    component="main"
                    display="flex"
                    flexDirection="column"
                    flexGrow={1}
                    p={1}
                >
                    <div className={styles.toolbar} />
                    {children}
                </Box>
            </Box>
        </ThemeProvider>
    );
};

const useDrawerStyles = makeStyles(theme =>
    createStyles({
        drawer: {
            [theme.breakpoints.up("sm")]: {
                flexShrink: 0,
                width: drawerWidth
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
                            anchor="left"
                            classes={{
                                paper: styles.drawerPaper
                            }}
                            ModalProps={{
                                keepMounted: true // Better open performance on mobile
                            }}
                            onClose={onClose}
                            open={open}
                            variant="temporary"
                        >
                            {children}
                        </Drawer>
                    )}
                </Observer>
            </Hidden>
            <Hidden xsDown implementation="css">
                <Drawer
                    open
                    classes={{
                        paper: styles.drawerPaper
                    }}
                    variant="permanent"
                >
                    {children}
                </Drawer>
            </Hidden>
        </nav>
    );
};
