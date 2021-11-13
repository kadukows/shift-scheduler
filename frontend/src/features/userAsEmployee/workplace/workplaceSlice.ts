import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    sortByLastModified,
    makeDispatchActionWhenAuthedObserver,
    getApiGenericThunkAction,
} from "../../helpers";
import { RootState } from "../../../store";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";

export interface Workplace {
    id: number;
    name: string;
    last_modified: string;
}

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
    name: "workplace",
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

export const workplaceActions = workplaceSlice.actions;
export const workplaceReducer = workplaceSlice.reducer;
export const workplaceSelectors = workplaceAdapter.getSelectors(
    (state: RootState) => state.employee_workplaceReducer
);

const getWorkplaces = getApiGenericThunkAction(
    workplaceActions.setLoading,
    workplaceActions.setAll,
    EMPLOYEE_API_ROUTES.workplace
);

export const workplaceObserver = makeDispatchActionWhenAuthedObserver(
    getWorkplaces,
    workplaceActions.resetAll
);
