import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    makeDispatchActionWhenAuthedObserver,
    getApiGenericThunkAction,
} from "../../helpers";
import { RootState } from "../../../store";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { Workplace } from "../../workplaces/workplaceSlice";

const workplaceAdapter = createEntityAdapter<Workplace>();

interface WorkplaceState
    extends ReturnType<typeof workplaceAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: WorkplaceState = {
    loading: false,
    loaded: false,
    ...workplaceAdapter.getInitialState(),
};

const workplaceSlice = createSlice({
    name: "employee_workplace",
    initialState,
    reducers: {
        setAll: workplaceAdapter.setAll,
        resetAll: workplaceAdapter.removeAll,
        addOne: workplaceAdapter.addOne,
        removeOne: workplaceAdapter.removeOne,
        removeMany: workplaceAdapter.removeMany,
        updateOne: workplaceAdapter.updateOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export type { Workplace };
export const workplaceActions = workplaceSlice.actions;
export const workplaceReducer = workplaceSlice.reducer;
export const workplaceSelectors = workplaceAdapter.getSelectors(
    (state: RootState) => state.employee_workplaceReducer
);

export const getWorkplaces = getApiGenericThunkAction(
    workplaceActions.setLoading,
    workplaceActions.setAll,
    EMPLOYEE_API_ROUTES.workplace
);

export const workplaceObserver = makeDispatchActionWhenAuthedObserver(
    getWorkplaces,
    workplaceActions.resetAll
);
