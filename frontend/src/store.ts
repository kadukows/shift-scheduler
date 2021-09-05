import { configureStore } from "@reduxjs/toolkit";
import { darkThemeProviderReducer } from "./features/darkThemeProvider/darkThemeProviderSlice";
import { alertsReducer } from "./features/alerts/alertsSlice";

export const store = configureStore({
    reducer: {
        darkThemeProviderReducer,
        alertsReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
