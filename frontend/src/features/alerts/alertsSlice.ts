import {
    createSlice,
    PayloadAction,
    ThunkAction,
    AnyAction,
    nanoid,
    Update,
} from "@reduxjs/toolkit";

export interface BaseAlert {
    type: "warning" | "info" | "success";
    message: string;
}

export interface Alert extends BaseAlert {
    id: string;
    options?: any;
    dismissed: boolean;
}

interface AlertsState {
    alerts: Alert[];
}

const initialState: AlertsState = {
    alerts: [],
};

const alertsSlice = createSlice({
    name: "alerts",
    initialState,
    reducers: {
        addAlert(state, action: PayloadAction<BaseAlert>) {
            state.alerts.push({
                id: nanoid(),
                dismissed: false,
                ...action.payload,
            });
        },
        updateAlert(state, action: PayloadAction<Update<Alert>>) {
            const alertIdx = state.alerts.findIndex(
                (alert) => alert.id === action.payload.id
            );

            if (alertIdx !== -1) {
                state.alerts[alertIdx] = {
                    ...state.alerts[alertIdx],
                    ...action.payload.changes,
                };
            }
        },
        removeAlert(state, action: PayloadAction<string>) {
            state.alerts = state.alerts.filter(
                (alert) => alert.id != action.payload
            );
        },
    },
});

export const { addAlert, removeAlert, updateAlert } = alertsSlice.actions;
export const alertsReducer = alertsSlice.reducer;
