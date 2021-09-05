import { configureStore } from "@reduxjs/toolkit";
import { darkThemeProviderReducer } from "./features/darkThemeProvider/darkThemeProviderSlice";
import { alertsReducer } from "./features/alerts/alertsSlice";
import { authReducer } from "./features/auth/authSlice";

export const store = configureStore({
    reducer: {
        darkThemeProviderReducer,
        alertsReducer,
        authReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
