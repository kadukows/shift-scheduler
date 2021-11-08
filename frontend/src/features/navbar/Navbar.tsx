import * as React from "react";
import { Link as RouterLink, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppBar, Toolbar, Button } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { styled } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

import DarkThemeToggler from "../darkThemeProvider/DarkThemeToggler";
import { combineClx } from "../helpers";
import { RootState } from "../../store";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    spacer: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: 2,
    },
}));

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);

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
        {/*<ButtonStyled to="/employees">Employees</ButtonStyled>*/}
        {/*<ButtonStyled to="/schedules">Schedule</ButtonStyled>*}
        {/*<ButtonStyled to="/planner">Planner</ButtonStyled>*/}
        {children}
        <ButtonStyled to="/logout">Logout</ButtonStyled>
    </>
);

const Navbar = () => {
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
            <Offset />
        </>
    );
};

export default Navbar;
