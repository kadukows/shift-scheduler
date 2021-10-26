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
import { potentialNewItemReducer } from "./features/planner/plannerGridByHours/potentialNewItemSlice";
import { addDialogReducer } from "./features/planner/plannerGridByHours/addDialogSlice";

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
        potentialNewItemReducer,
        addDialogReducer,
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
