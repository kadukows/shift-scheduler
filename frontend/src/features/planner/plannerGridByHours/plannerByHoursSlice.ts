import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import * as DateFns from "date-fns";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../../helpers";
import { RootState } from "../../../store";

interface PlannerByHoursState {
    potentialNewShift: {
        start: number; // unix time
        end: number;
        itemId: number; // either role or employee id
    };
    isDragging: boolean;
}

const initialState: PlannerByHoursState = {
    potentialNewShift: {
        start: null,
        end: null,
        itemId: null,
    },
    isDragging: false,
};

const plannerByHourSlice = createSlice({
    name: "plannerByHour",
    initialState,
    reducers: {
        potentialNewShiftSetStart(state, { payload }: PayloadAction<number>) {
            state.potentialNewShift.start = payload;
            state.isDragging = true;
        },
        potentationNewShiftSetSendParam(
            state,
            { payload }: PayloadAction<number>
        ) {
            if (!state.potentialNewShift.start) {
                state.potentialNewShift.start = payload;
                return;
            }

            if (payload < state.potentialNewShift.start) {
                state.potentialNewShift.end = state.potentialNewShift.start;
                state.potentialNewShift.start = payload;
            } else {
                state.potentialNewShift.end = payload;
            }
        },
        potentationNewShiftReset(state) {
            state.potentialNewShift = { start: null, end: null, itemId: null };
            state.isDragging = false;
        },
        potentationNewShiftSetItemId(
            state,
            { payload }: PayloadAction<number>
        ) {
            state.potentialNewShift.itemId = payload;
        },
        setIsDragging(state, { payload }: PayloadAction<boolean>) {
            state.isDragging = payload;
        },
    },
});

export const {
    potentialNewShiftSetStart,
    potentationNewShiftSetSendParam,
    potentationNewShiftReset,
    potentationNewShiftSetItemId,
    setIsDragging,
} = plannerByHourSlice.actions;

export const plannerByHourReducer = plannerByHourSlice.reducer;
