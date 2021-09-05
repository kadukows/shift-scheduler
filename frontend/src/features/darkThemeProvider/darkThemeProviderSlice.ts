import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DarkThemeState {
    darkMode: boolean;
}

const initialState: DarkThemeState = {
    darkMode: true,
};

const darkThemeProviderSlice = createSlice({
    name: "darkThemeProvider",
    initialState,
    reducers: {
        setDarkMode(state, action: PayloadAction<boolean>) {
            state.darkMode = action.payload;
        },
        toggleDarkMode(state) {
            state.darkMode = !state.darkMode;
        },
    },
});

export const { setDarkMode, toggleDarkMode } = darkThemeProviderSlice.actions;
export const darkThemeProviderReducer = darkThemeProviderSlice.reducer;
