import {
    createSlice,
    PayloadAction,
    ThunkAction,
    AnyAction,
    nanoid,
} from "@reduxjs/toolkit";

export interface Alert {
    type: "warning" | "info" | "success";
    message: string;
}

export type AlertWithId = Alert & { id: string };

interface AlertsState {
    alerts: AlertWithId[];
}

const initialState: AlertsState = {
    alerts: [],
};

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        addAlert(state, action: PayloadAction<Alert>) {
            state.alerts.push({ id: nanoid(), ...action.payload });
        },
        removeAlert(state, action: PayloadAction<string>) {
            state.alerts = state.alerts.filter(
                (alert) => alert.id != action.payload
            );
        },
    },
});

export const { addAlert, removeAlert } = alertsSlice.actions;
export const alertsReducer = alertsSlice.reducer;
