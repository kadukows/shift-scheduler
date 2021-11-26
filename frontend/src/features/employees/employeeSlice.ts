import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../helpers";
import { RootState } from "../../store";
import { MANAGER_API_ROUTES } from "../../ApiRoutes";

export interface Employee {
    id: number;
    last_name: string;
    first_name: string;
    workplace: number;
    bound_to?: number;
    bounding_key?: string;
    last_modified: string;
    preffered_roles: number[];
}

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
    name: "employee",
    initialState,
    reducers: {
        addEmployee: employeeAdapter.addOne,
        setEmployees: employeeAdapter.setAll,
        resetEmployees: employeeAdapter.removeAll,
        removeEmployee: employeeAdapter.removeOne,
        updateEmployee: employeeAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

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

const getEmployees = getApiGenericThunkAction(
    setLoading,
    setEmployees,
    MANAGER_API_ROUTES.employee
);

export const employeeObserver = makeDispatchActionWhenAuthedObserver(
    getEmployees,
    resetEmployees
);
