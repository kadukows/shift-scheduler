import * as React from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider } from "@material-ui/core";

import { RootState } from "../../store";

interface Props {}

const DarkThemeProvider = ({ children }: React.PropsWithChildren<Props>) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );

    const theme = React.useMemo(
        () =>
            createTheme({
                palette: {
                    type: darkMode ? "dark" : "light",
                },
            }),
        [darkMode]
    );

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DarkThemeProvider;
