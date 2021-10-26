import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PlannerGridByHoursState {
    start: number;
    end: number;
    secondIndexItemId: number;
}

const initialState: PlannerGridByHoursState = {
    start: null,
    end: null,
    secondIndexItemId: null,
};

const plannerGridByHoursSlice = createSlice({
    name: "plannerGridByHours",
    initialState,
    reducers: {
        setStart(state, action: PayloadAction<number>) {
            state.start = action.payload;
        },
        setEnd(state, action: PayloadAction<number>) {
            state.end = action.payload;
        },
        setSecondIndex(state, action: PayloadAction<number>) {
            state.secondIndexItemId = action.payload;
        },
        reset(state) {
            state.start = null;
            state.end = null;
            state.secondIndexItemId = null;
        },
        set(state, action: PayloadAction<PlannerGridByHoursState>) {
            state.start = action.payload.start;
            state.end = action.payload.end;
            state.secondIndexItemId = action.payload.secondIndexItemId;
        },
    },
});

export const { setStart, setEnd, setSecondIndex, reset, set } =
    plannerGridByHoursSlice.actions;

export const plannerGridByHoursReducer = plannerGridByHoursSlice.reducer;
