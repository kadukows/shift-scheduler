import { configureStore } from "@reduxjs/toolkit";
import { darkThemeProviderReducer } from "./features/darkThemeProvider/darkThemeProviderSlice";
import { alertsReducer } from "./features/alerts/alertsSlice";
import { authReducer } from "./features/auth/authSlice";
import {
    workplaceReducer,
    workplaceObserver,
} from "./features/workplaces/workplaceSlice";
import {
    employeeReducer,
    employeeObserver,
} from "./features/employees/employeeSlice";
import {
    scheduleReducer,
    scheduleObserver,
} from "./features/schedules/scheduleSlice";
import { draggableThingsReducer } from "./features/draggableOnMuiTable/draggableThingsSlice";
import { roleReducer, roleObserver } from "./features/roles/rolesSlice";
import { shiftReducer, shiftObserver } from "./features/shifts/shiftSlice";
import { plannerByHourReducer } from "./features/planner/plannerGridByHours/plannerByHoursSlice"

import { observe } from "redux-observers";

export const store = configureStore({
    reducer: {
        darkThemeProviderReducer,
        alertsReducer,
        authReducer,
        workplaceReducer,
        employeeReducer,
        scheduleReducer,
        draggableThingsReducer,
        roleReducer,
        shiftReducer,
        plannerByHourReducer
    },
});

export type RootState = ReturnType<typeof store.getState>;

observe(store, [
    workplaceObserver,
    employeeObserver,
    scheduleObserver,
    roleObserver,
    shiftObserver,
]);
