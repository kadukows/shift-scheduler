import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import {
    getTokenRequestConfig,
    sortByLastModified,
    makeDispatchActionWhenAuthedObserver,
    getApiGenericThunkAction,
} from "../helpers";
import { RootState } from "../../store";

export interface Workplace {
    id: number;
    name: string;
    last_modified: string;
}

const workplaceAdapter = createEntityAdapter<Workplace>({
    sortComparer: sortByLastModified,
});

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

export const getWorkplaces = getApiGenericThunkAction(
    setLoading,
    setWorkplaces,
    "/api/workplace/"
);

export const workplaceObserver = makeDispatchActionWhenAuthedObserver(
    getWorkplaces,
    resetWorkplaces
);
