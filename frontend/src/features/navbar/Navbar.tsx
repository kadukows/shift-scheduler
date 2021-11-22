import * as React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    AppBar,
    Toolbar,
    Button,
    styled,
    TextField,
    MenuItem,
    Typography,
} from "@mui/material";
import { Menu as MenuIcon, RestartAlt } from "@mui/icons-material";
import DarkThemeToggler from "../darkThemeProvider/DarkThemeToggler";
import { RootState } from "../../store";
import UserProfileList from "./UserProfileList";
import { WebsiteMode } from "./WebsiteMode";

const Navbar = () => {
    const [mode, setMode] = React.useState<WebsiteMode>(
        (localStorage.getItem("website-mode") as WebsiteMode) ??
            WebsiteMode.Manager
    );
    const history = useHistory();
    const authed = useSelector(
        (state: RootState) => state.authReducer.authenticated
    );

    React.useEffect(() => {
        localStorage.setItem("website-mode", mode);
    }, [mode]);

    const onChangeMode = React.useCallback(
        (value: WebsiteMode) => {
            if (mode !== value) {
                history.push("/");
            }

            setMode(value);
        },
        [mode, history, setMode]
    );

    /*
    TODO

    const locationMode = useMode();
    React.useEffect(() => {
        if (locationMode && locationMode !== mode) {
            setMode(locationMode);
        }
    }, [locationMode, setMode, mode]);
    */

    return (
        <>
            <GrowingDiv>
                <AppBar position="absolute">
                    <Toolbar>
                        <NavButton to="/draggables">
                            <MenuIcon />
                        </NavButton>

                        <NavButton to="/">Index</NavButton>
                        {authed ? (
                            <AuthLink mode={mode} setMode={onChangeMode} />
                        ) : (
                            <NoAuthLink />
                        )}
                        <DarkThemeToggler />
                    </Toolbar>
                </AppBar>
            </GrowingDiv>
            <Offset />
        </>
    );
};

export default Navbar;

/**
 *
 */

const Offset = styled("div")(({ theme }) => theme.mixins.toolbar);
const Spacer = styled("div")({ flex: 1 });
const GrowingDiv = styled("div")({
    flexGrow: 1,
});

const NoAuthLink = () => (
    <>
        <Spacer />
        <NavButton to="/login">Login</NavButton>
    </>
);

interface WebsiteModeSelectProps {
    mode: WebsiteMode;
    setMode: (value: WebsiteMode) => void;
}

const AuthLink = ({ mode, setMode }: WebsiteModeSelectProps) => (
    <>
        {mode === WebsiteMode.Manager ? (
            <NavButton to="/workplaces">Workplaces</NavButton>
        ) : (
            <NavButton to="/as_employee/dashboard">Dashboard</NavButton>
        )}
        <Spacer />
        <WebsiteModeSelect mode={mode} setMode={setMode} />
        <UserProfileList />
    </>
);

const WebsiteModeSelect = ({ mode, setMode }: WebsiteModeSelectProps) => {
    return (
        <MyTextField
            select
            variant="standard"
            value={mode}
            onChange={(e) => {
                setMode(e.target.value as WebsiteMode);
            }}
            inputProps={inputProps}
            SelectProps={{
                renderValue: (value) => (
                    <Typography variant="button">{value}</Typography>
                ),
            }}
        >
            <MenuItem value={WebsiteMode.Manager}>
                <Typography variant="button">Manager</Typography>
            </MenuItem>
            <MenuItem value={WebsiteMode.Employee}>
                <Typography variant="button">Employee</Typography>
            </MenuItem>
        </MyTextField>
    );
};

const NavButton = (
    props: React.ComponentProps<typeof Button> &
        React.ComponentProps<typeof NavLink>
) => (
    <Button
        color="inherit"
        component={NavLink}
        activeClassName="Mui-disabled"
        exact
        {...props}
    />
);

const inputProps = {
    color: "inherit",
};

const MyTextField = styled(TextField)(({ theme }) => ({
    minWidth: 80,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
})) as typeof TextField;
