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

export interface Shift {
    id: number;
    schedule: number;
    employee: number;
    time_from: string;
    time_to: string;
    role: number;
}

const shiftAdapter = createEntityAdapter<Shift>();

interface ShiftState extends ReturnType<typeof shiftAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: ShiftState = {
    loaded: false,
    loading: false,
    ...shiftAdapter.getInitialState(),
};

const shiftSlice = createSlice({
    name: "shift",
    initialState,
    reducers: {
        setShifts: shiftAdapter.setAll,
        resetShifts: shiftAdapter.removeAll,
        //
        addShift: shiftAdapter.addOne,
        removeShift: shiftAdapter.removeOne,
        updateShift: shiftAdapter.updateOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const shiftSelectors = shiftAdapter.getSelectors(
    (state: RootState) => state.shiftReducer
);

export const {
    setShifts,
    resetShifts,
    addShift,
    removeShift,
    updateShift,
    setLoading,
} = shiftSlice.actions;

export const shiftReducer = shiftSlice.reducer;

const getShifts = getApiGenericThunkAction(
    setLoading,
    setShifts,
    "/api/shift/"
);

export const shiftObserver = makeDispatchActionWhenAuthedObserver(
    getShifts,
    resetShifts
);
