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

//import "./style.css";

const Navbar = () => {
    const [mode, setMode] = React.useState<WebsiteMode>(WebsiteMode.Manager);
    const history = useHistory();
    const authed = useSelector(
        (state: RootState) => state.authReducer.authenticated
    );

    const onChangeMode = React.useCallback(
        (value: WebsiteMode) => {
            if (mode !== value) {
                history.push("/");
            }

            setMode(value);
        },
        [mode, history, setMode]
    );

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
const ButtonMarginRight = styled(Button)({
    marginRight: 4,
});
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

const AuthLink = (props: WebsiteModeSelectProps) => (
    <>
        <NavButton to="/workplaces">Workplaces</NavButton>
        <Spacer />
        <WebsiteModeSelect {...props} />
        <NavButton to="/logout">Logout</NavButton>
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
                    <WhiteTypography variant="button">{value}</WhiteTypography>
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

enum WebsiteMode {
    Manager = "Manager",
    Employee = "Employee",
}

const inputProps = {
    color: "inherit",
};

const MyTextField = styled(TextField)(({ theme }) => ({
    minWidth: 80,
    marginRight: theme.spacing(2),
    marginLeft: theme.spacing(2),
    //color: "white",
})) as typeof TextField;

const WhiteTypography = styled(Typography)({
    //color: "white",
});
