import * as React from "react";
import { useSelector } from "react-redux";
import {
    createTheme,
    ThemeProvider,
    ThemeOptions,
    useTheme,
} from "@mui/material/styles";

import { RootState } from "../../store";

declare module "@mui/material/styles" {
    interface Theme {
        status: {
            plannerByHoursItemColor: string;
            plannerByHoursItemBorder: string;
            plannerByHoursItemHover: string;
        };
    }
    // allow configuration using `createTheme`
    interface ThemeOptions {
        status?: {
            plannerByHoursItemColor?: string;
            plannerByHoursItemBorder?: string;
            plannerByHoursItemHover?: string;
        };
    }
}

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
            status: {
                plannerByHoursItemColor: darkMode
                    ? "rgb(128, 128, 128)"
                    : "rgb(220, 220, 220)",
                plannerByHoursItemHover: darkMode
                    ? "rgb(148, 148, 148)"
                    : "rgb(240, 240, 240)",
                plannerByHoursItemBorder: `1px solid ${
                    darkMode ? "white" : "lightgray"
                }`,
            },
        };

        return createTheme(theme);
    }, [darkMode]);

    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default DarkThemeProvider;
