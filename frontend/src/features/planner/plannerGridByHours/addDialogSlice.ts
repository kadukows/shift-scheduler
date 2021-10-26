import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AddDialogState {
    start: number;
    end: number;
    secondIndexItemId: number;
    open: boolean;
}

const initialState: AddDialogState = {
    start: null,
    end: null,
    secondIndexItemId: null,
    open: false,
};

const addDialogSlice = createSlice({
    name: "addDialog",
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
                payload: { start, end, secondIndexItemId, open },
            }: PayloadAction<Partial<AddDialogState>>
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

            if (typeof open === "boolean") {
                state.open = open;
            }
        },
    },
});

export const { reset, set } = addDialogSlice.actions;

export const addDialogReducer = addDialogSlice.reducer;
