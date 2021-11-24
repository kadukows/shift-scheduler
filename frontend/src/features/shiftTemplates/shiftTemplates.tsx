import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import { observer } from "redux-observers";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../helpers";
import { RootState } from "../../store";
import { MANAGER_API_ROUTES } from "../../ApiRoutes";

export interface ShiftTemplate {
    id: number;
    workplace: number;
    time_from: string;
    time_to: string;
}

const shiftTemplateAdapter = createEntityAdapter<ShiftTemplate>();

const initialState = {
    loaded: false,
    loading: false,
    ...shiftTemplateAdapter.getInitialState(),
};

const shiftTemplateSlice = createSlice({
    name: "shiftTemplate",
    initialState,
    reducers: {
        setAll: shiftTemplateAdapter.setAll,
        removeAll: shiftTemplateAdapter.removeAll,
        addOne: shiftTemplateAdapter.addOne,
        removeOne: shiftTemplateAdapter.removeOne,
        updateOne: shiftTemplateAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const shiftTemplateReducer = shiftTemplateSlice.reducer;
export const shiftTemplateActions = shiftTemplateSlice.actions;
export const shiftTemplateSelectors = shiftTemplateAdapter.getSelectors(
    (state: RootState) => state.shiftTemplateReducer
);

export const getShiftTemplates = getApiGenericThunkAction(
    shiftTemplateActions.setLoading,
    shiftTemplateActions.setAll,
    MANAGER_API_ROUTES.shiftTemplate
);

export const shiftTemplateObserver = makeDispatchActionWhenAuthedObserver(
    getShiftTemplates,
    shiftTemplateActions.removeAll
);
