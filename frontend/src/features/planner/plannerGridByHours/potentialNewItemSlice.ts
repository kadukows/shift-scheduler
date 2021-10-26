import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PotentialNewItemState {
    start: number;
    end: number;
    secondIndexItemId: number;
}

const initialState: PotentialNewItemState = {
    start: null,
    end: null,
    secondIndexItemId: null,
};

const potentialNewItemSlice = createSlice({
    name: "plannerGridByHours",
    initialState,
    reducers: {
        reset(state) {
            state.start = null;
            state.end = null;
            state.secondIndexItemId = null;
        },
        set(
            state,
            {
                payload: { start, end, secondIndexItemId },
            }: PayloadAction<Partial<PotentialNewItemState>>
        ) {
            if (start !== undefined) {
                state.start = start;
            }

            if (end !== undefined) {
                state.end = end;
            }

            if (secondIndexItemId !== undefined) {
                state.secondIndexItemId = secondIndexItemId;
            }
        },
    },
});

export const { reset, set } = potentialNewItemSlice.actions;

export const potentialNewItemReducer = potentialNewItemSlice.reducer;
