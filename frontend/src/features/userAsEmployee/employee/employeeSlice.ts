import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import { Employee } from "../../employees/employeeSlice";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../../helpers";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { RootState } from "../../../store";

const employeeAdapter = createEntityAdapter<Employee>();

interface EmployeeState
    extends ReturnType<typeof employeeAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: EmployeeState = {
    loading: false,
    loaded: false,
    ...employeeAdapter.getInitialState(),
};

const employeeSlice = createSlice({
    name: "employee_employee",
    initialState,
    reducers: {
        setAll: employeeAdapter.setAll,
        resetAll(state, action) {
            state.loaded = false;
            return employeeAdapter.removeAll(state);
        },
        addOne: employeeAdapter.addOne,
        removeOne: employeeAdapter.removeOne,
        updateOne: employeeAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export type { Employee };
export const employeeReducer = employeeSlice.reducer;
export const employeeActions = employeeSlice.actions;
export const employeeSelectors = employeeAdapter.getSelectors(
    (state: RootState) => state.employee_employeeReducer
);

const getEmployees = getApiGenericThunkAction(
    employeeActions.setLoading,
    employeeActions.setAll,
    EMPLOYEE_API_ROUTES.employee
);

export const employeeObserver = makeDispatchActionWhenAuthedObserver(
    getEmployees,
    employeeActions.resetAll
);
