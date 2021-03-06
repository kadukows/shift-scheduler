import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    sortByLastModified,
    makeDispatchActionWhenAuthedObserver,
    getApiGenericThunkAction,
} from "../helpers";
import { RootState } from "../../store";
import { MANAGER_API_ROUTES } from "../../ApiRoutes";

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
        setWorkplaces: workplaceAdapter.setAll,
        resetWorkplaces: workplaceAdapter.removeAll,
        addWorkplace: workplaceAdapter.addOne,
        removeWorkplace: workplaceAdapter.removeOne,
        removeWorkplaces: workplaceAdapter.removeMany,
        updateWorkplace: workplaceAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const workplaceSelectors = workplaceAdapter.getSelectors(
    (state: RootState) => state.workplaceReducer
);
export const {
    setWorkplaces,
    resetWorkplaces,
    addWorkplace,
    removeWorkplace,
    updateWorkplace,
    setLoading,
    removeWorkplaces,
} = workplaceSlice.actions;
export const workplaceReducer = workplaceSlice.reducer;

const getWorkplaces = getApiGenericThunkAction(
    setLoading,
    setWorkplaces,
    MANAGER_API_ROUTES.workplace
);

export const workplaceObserver = makeDispatchActionWhenAuthedObserver(
    getWorkplaces,
    resetWorkplaces
);
