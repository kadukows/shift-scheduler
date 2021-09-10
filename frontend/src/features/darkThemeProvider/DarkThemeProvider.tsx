import * as React from "react";
import { useSelector } from "react-redux";
import {
    createTheme,
    responsiveFontSizes,
    ThemeProvider,
} from "@material-ui/core";
import blue from "@material-ui/core/colors/blue";

import { RootState } from "../../store";

interface Props {}

const DarkThemeProvider = ({ children }: React.PropsWithChildren<Props>) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );

    const theme = React.useMemo(
        () =>
            responsiveFontSizes(
                createTheme({
                    palette: {
                        type: darkMode ? "dark" : "light",
                        primary: darkMode
                            ? {
                                  main: blue[700],
                              }
                            : {
                                  main: blue[800],
                              },
                    },
                })
            ),
        [darkMode]
    );

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DarkThemeProvider;
