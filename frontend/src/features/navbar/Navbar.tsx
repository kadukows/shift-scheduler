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
    menuButton: {
        marginRight: theme.spacing(2),
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

    const MyButton = (
        props: React.ComponentProps<typeof Button> &
            React.ComponentProps<typeof RouterLink>
    ) => (
        <Button
            color="inherit"
            component={RouterLink}
            className={classes.menuButton}
            {...props}
        />
    );

    return (
        <>
            <div className={classes.root}>
                <AppBar position="absolute">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            color="inherit"
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>

                        <MyButton to="/">Index</MyButton>
                        <div className={classes.spacer} />
                        <DarkThemeToggler />
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.appbarSpacer} />
        </>
    );
};

export default Navbar;
