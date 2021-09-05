import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { observer } from "redux-observers";

import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";
import { addWorkplaces } from "../workplaces/workplaceSlice";

interface Employee {
    id: number;
    last_name: string;
    first_name: string;
    workplace: number;
    last_modified: string;
}

const employeeAdapter = createEntityAdapter<Employee>({
    selectId: (employee) => employee.id,
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
        addEmployees: employeeAdapter.setAll,
        removeEmployee: employeeAdapter.removeOne,
        updateEmployee: employeeAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { addEmployees, removeEmployee, updateEmployee, setLoading } =
    employeeSlice.actions;
export const employeeReducer = employeeSlice.reducer;

export const getEmployees =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        dispatch(setLoading(true));

        try {
            const res = await axios.get<Employee[]>(
                "/api/employee/",
                getTokenRequestConfig(getState().authReducer.token)
            );

            dispatch(addEmployees(res.data));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const employeeObserver = observer(
    (state: RootState) => state.authReducer.authenticated,
    (dispatch, current, previous) => {
        if (previous === false && current === true) {
            // @ts-expect-error
            dispatch(getEmployees());
        }
    }
);
