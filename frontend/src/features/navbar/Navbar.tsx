import * as React from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, Button, Grid, IconButton } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Menu as MenuIcon } from "@mui/icons-material";

import DarkThemeToggler from "../darkThemeProvider/DarkThemeToggler";
import { combineClx } from "../helpers";
import { RootState } from "../../store";

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

type LinksProps = React.PropsWithChildren<{ ButtonStyled: React.ElementType }>;

const NoAuthLink = ({ ButtonStyled, children }: LinksProps) => (
    <>
        {children}
        <ButtonStyled to="/login">Login</ButtonStyled>
    </>
);
const AuthLink = ({ ButtonStyled, children }: LinksProps) => (
    <>
        <ButtonStyled to="/workplaces">Workplaces</ButtonStyled>
        <ButtonStyled to="/employees">Employees</ButtonStyled>
        <ButtonStyled to="/schedules">Schedule</ButtonStyled>
        {/*<ButtonStyled to="/planner">Planner</ButtonStyled>*/}
        {children}
        <ButtonStyled to="/logout">Logout</ButtonStyled>
    </>
);

const Navbar = (props: Props) => {
    const classes = useStyles();
    const auth = useSelector((state: RootState) => state.authReducer);

    const MyButton = ({
        className,
        ...rest
    }: React.ComponentProps<typeof Button> &
        React.ComponentProps<typeof NavLink>) => (
        <Button
            color="inherit"
            component={NavLink}
            className={combineClx(classes.menuButton, className)}
            activeClassName="Mui-disabled"
            exact
            {...rest}
        />
    );

    const Links = auth.authenticated
        ? (props: any) => <AuthLink ButtonStyled={MyButton} {...props} />
        : (props: any) => <NoAuthLink ButtonStyled={MyButton} {...props} />;

    return (
        <>
            <div className={classes.root}>
                <AppBar position="absolute">
                    <Toolbar>
                        {/*
                        <IconButton
                            edge="start"
                            color="inherit"
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        */}
                        <MyButton to="/draggables">
                            <MenuIcon />
                        </MyButton>

                        <MyButton to="/">Index</MyButton>
                        <Links>
                            <div className={classes.spacer} />
                        </Links>
                        <DarkThemeToggler />
                    </Toolbar>
                </AppBar>
            </div>
            <div className={classes.appbarSpacer} />
        </>
    );
};

export default Navbar;
