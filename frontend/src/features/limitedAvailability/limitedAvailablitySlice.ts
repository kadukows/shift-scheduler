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

export enum LA_Type {
    FreeDay = "FREE",
    Preference = "PREF",
}

export interface LimitedAvailability {
    id: number;
    date: string;
    employee: number;
    la_type: LA_Type;
    shift_templates: number[];
}

const limitedAvailabilityAdapter = createEntityAdapter<LimitedAvailability>();

const initialState = {
    loaded: false,
    loading: false,
    ...limitedAvailabilityAdapter.getInitialState(),
};

const limitedAvailabilitySlice = createSlice({
    name: "limitedAvailability",
    initialState,
    reducers: {
        setAll: limitedAvailabilityAdapter.setAll,
        removeAll: limitedAvailabilityAdapter.removeAll,
        addOne: limitedAvailabilityAdapter.addOne,
        removeOne: limitedAvailabilityAdapter.removeOne,
        updateOne: limitedAvailabilityAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const limitedAvailabilityReducer = limitedAvailabilitySlice.reducer;
export const limitedAvailabilityActions = limitedAvailabilitySlice.actions;
export const limitedAvailabilitySelectors =
    limitedAvailabilityAdapter.getSelectors(
        (state: RootState) => state.limitedAvailabilityReducer
    );

export const getLimitedAvailability = getApiGenericThunkAction(
    limitedAvailabilityActions.setLoading,
    limitedAvailabilityActions.setAll,
    MANAGER_API_ROUTES.limitedAvailability
);

export const limitedAvailabilityObserver = makeDispatchActionWhenAuthedObserver(
    getLimitedAvailability,
    limitedAvailabilityActions.removeAll
);
