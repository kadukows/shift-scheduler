import * as React from "react";
import { useSelector } from "react-redux";
import { createTheme, ThemeProvider, ThemeOptions } from "@mui/material/styles";
import { blue } from "@mui/material/colors";

import { RootState } from "../../store";

interface Props {}

const DarkThemeProvider = ({ children }: React.PropsWithChildren<Props>) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );

    const theme = React.useMemo(() => {
        const theme: ThemeOptions = {
            palette: {
                mode: (darkMode ? "dark" : "light") as "dark" | "light",
            },
            components: {
                MuiInput: {
                    styleOverrides: {
                        root: {
                            color: "inherit",
                        },
                    },
                },
                MuiPaper: {
                    defaultProps: {
                        elevation: darkMode ? 3 : 6,
                    },
                },
            },
        };

        return createTheme(theme);
    }, [darkMode]);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DarkThemeProvider;
