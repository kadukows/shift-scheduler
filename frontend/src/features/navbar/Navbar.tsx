import * as React from "react";
import { Link as RouterLink } from "react-router-dom";
import { useSelector } from "react-redux";
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

const MyButton = (
    props: React.ComponentProps<typeof Button> &
        React.ComponentProps<typeof RouterLink>
) => (
    <Grid item>
        <Button color="inherit" component={RouterLink} {...props} />
    </Grid>
);

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
        React.ComponentProps<typeof RouterLink>) => (
        <Button
            color="inherit"
            component={RouterLink}
            className={combineClx(classes.menuButton, className)}
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
                        <IconButton
                            edge="start"
                            color="inherit"
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>

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
