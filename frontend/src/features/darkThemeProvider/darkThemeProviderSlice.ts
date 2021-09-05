import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DarkThemeState {
    darkMode: boolean;
}

const initialState: DarkThemeState = {
    darkMode:
        localStorage.getItem("darkMode") === null
            ? false
            : localStorage.getItem("darkMode") === "dark",
};

const darkThemeProviderSlice = createSlice({
    name: "darkThemeProvider",
    initialState,
    reducers: {
        setDarkMode(state, action: PayloadAction<boolean>) {
            state.darkMode = action.payload;
            localStorage.setItem("darkMode", state.darkMode ? "dark" : "light");
        },
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
            localStorage.setItem("darkMode", state.darkMode ? "dark" : "light");
        },
    },
});

export const { setDarkMode, toggleDarkMode } = darkThemeProviderSlice.actions;
export const darkThemeProviderReducer = darkThemeProviderSlice.reducer;
