import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";

import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
    sortByLastModified,
} from "../helpers";
import { RootState } from "../../store";

export interface Employee {
    id: number;
    last_name: string;
    first_name: string;
    workplace: number;
    last_modified: string;
}

const employeeAdapter = createEntityAdapter<Employee>({
    sortComparer: sortByLastModified,
});

interface EmployeeState
    extends ReturnType<typeof employeeAdapter.getInitialState> {
    loading: boolean;
}

const initialState: EmployeeState = {
    loading: false,
    ...employeeAdapter.getInitialState(),
};

const employeeSlice = createSlice({
    name: "employee",
    initialState,
    reducers: {
        addEmployee: employeeAdapter.addOne,
        setEmployees: employeeAdapter.setAll,
        resetEmployees: employeeAdapter.removeAll,
        removeEmployee: employeeAdapter.removeOne,
        updateEmployee: employeeAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const employeeSelectors = employeeAdapter.getSelectors(
    (state: RootState) => state.employeeReducer
);
export const {
    addEmployee,
    setEmployees,
    resetEmployees,
    removeEmployee,
    updateEmployee,
    setLoading,
} = employeeSlice.actions;
export const employeeReducer = employeeSlice.reducer;

export const getEmployees = getApiGenericThunkAction(
    setLoading,
    setEmployees,
    "/api/employee/"
);

export const employeeObserver = makeDispatchActionWhenAuthedObserver(
    getEmployees,
    resetEmployees
);
