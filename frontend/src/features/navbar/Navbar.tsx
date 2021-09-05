import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
    makeStyles,
    AppBar,
    Toolbar,
    Button,
    Grid,
    IconButton,
} from "@material-ui/core";
import { Menu as MenuIcon } from "@material-ui/icons";

import DarkThemeToggler from "../darkThemeProvider/DarkThemeToggler";

interface Props {}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    spacer: {
        flexGrow: 1,
    },
    appbarSpacer: theme.mixins.toolbar,
}));

const MyButton = (
    props: React.ComponentProps<typeof Button> &
        React.ComponentProps<typeof RouterLink>
) => (
    <Grid item>
        <Button color="inherit" component={RouterLink} {...props} />
    </Grid>
);

const Navbar = (props: Props) => {
    const classes = useStyles();

    return (
        <>
            <div className={classes.root}>
                <AppBar position="absolute">
                    <Toolbar>
                        <Grid container spacing={2} justifyContent="flex-start">
                            <Grid item>
                                <IconButton edge="start" color="inherit">
                                    <MenuIcon />
                                </IconButton>
                            </Grid>

                            <MyButton to="/">Index</MyButton>
                            <Grid item>
                                <div className={classes.spacer} />
                            </Grid>
                            <Grid item>
                                <DarkThemeToggler />
                            </Grid>
                        </Grid>
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.appbarSpacer} />
        </>
    );
};

export default Navbar;
