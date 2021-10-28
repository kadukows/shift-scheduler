import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UpdateDialogState {
    shiftId: number | null;
    open: boolean;
}

const initialState: UpdateDialogState = {
    shiftId: null,
    open: false,
};

const updateDialogSlice = createSlice({
    name: "updateDialog",
    initialState,
    reducers: {
        reset(state) {
            state.shiftId = null;
            state.open = false;
        },
        set(
            state,
            {
                payload: { shiftId, open },
            }: PayloadAction<Partial<UpdateDialogState>>
        ) {
            if (shiftId !== undefined) {
                state.shiftId = shiftId;
            }

            if (open !== undefined) {
                state.open = open;
            }
        },
    },
});

export const { reset, set } = updateDialogSlice.actions;

export const updateDialogReducer = updateDialogSlice.reducer;
