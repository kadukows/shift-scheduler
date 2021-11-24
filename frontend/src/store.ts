import { configureStore } from "@reduxjs/toolkit";
import { observe } from "redux-observers";
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
import {
    shiftReducer,
    shiftObserver,
    deleteShiftWhenRoleDeletedObserver,
    deleteShiftWhenEmployeeDeletedObserver,
    deleteShiftWhenScheduleDeletedObserver,
} from "./features/shifts/shiftSlice";
import { potentialNewItemReducer } from "./features/planner/plannerGridByHours/potentialNewItemSlice";
import { addDialogReducer } from "./features/planner/dialogs/addDialogSlice";
import { updateDialogReducer } from "./features/planner/dialogs/updateDialogSlice";
import {
    shiftTemplateReducer,
    shiftTemplateObserver,
} from "./features/shiftTemplates/shiftTemplates";
//
import * as EmployeeEmployee from "./features/userAsEmployee/employee/employeeSlice";
import * as EmployeeRole from "./features/userAsEmployee/role/roleSlice";
import * as EmployeeSchedule from "./features/userAsEmployee/schedule/scheduleSlice";
import * as EmployeeShift from "./features/userAsEmployee/shift/shiftSlice";
import * as EmployeeWorkplace from "./features/userAsEmployee/workplace/workplaceSlice";

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
        updateDialogReducer,
        shiftTemplateReducer,
        employee_employeeReducer: EmployeeEmployee.employeeReducer,
        employee_roleReducer: EmployeeRole.roleReducer,
        employee_scheduleReducer: EmployeeSchedule.scheduleReducer,
        employee_shiftReducer: EmployeeShift.shiftReducer,
        employee_workplaceReducer: EmployeeWorkplace.workplaceReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;

observe(store, [
    workplaceObserver,
    employeeObserver,
    scheduleObserver,
    roleObserver,
    shiftObserver,
    deleteShiftWhenRoleDeletedObserver,
    deleteShiftWhenEmployeeDeletedObserver,
    deleteShiftWhenScheduleDeletedObserver,
    shiftTemplateObserver,
    EmployeeEmployee.employeeObserver,
    EmployeeRole.roleObserver,
    EmployeeSchedule.scheduleObserver,
    EmployeeShift.shiftObserver,
    EmployeeWorkplace.workplaceObserver,
]);
