import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@material-ui/core";
import { Brightness4, Brightness7 } from "@material-ui/icons";

import { RootState } from "../../store";
import { toggleDarkMode } from "./darkThemeProviderSlice";

interface Props {}

const DarkThemeToggler = (props: Props) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );
    const dispatch = useDispatch();

    return (
        <Button color="inherit" onClick={() => dispatch(toggleDarkMode())}>
            {darkMode ? <Brightness7 /> : <Brightness4 />}
        </Button>
    );
};

export default DarkThemeToggler;
