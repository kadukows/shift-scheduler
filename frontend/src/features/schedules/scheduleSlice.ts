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

export interface Schedule {
    id: number;
    workplace: number;
    month_year: string;
    last_modified: string;
}

const scheduleAdapter = createEntityAdapter<Schedule>();

interface ScheduleState
    extends ReturnType<typeof scheduleAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: ScheduleState = {
    loading: false,
    loaded: false,
    ...scheduleAdapter.getInitialState(),
};

const scheduleSlice = createSlice({
    name: "schedule",
    initialState,
    reducers: {
        setSchedules: scheduleAdapter.setAll,
        resetSchedules: scheduleAdapter.removeAll,
        //
        addSchedule: scheduleAdapter.addOne,
        removeSchedule: scheduleAdapter.removeOne,
        updateSchedule: scheduleAdapter.updateOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const scheduleSelectors = scheduleAdapter.getSelectors(
    (state: RootState) => state.scheduleReducer
);

export const {
    setSchedules,
    resetSchedules,
    addSchedule,
    removeSchedule,
    updateSchedule,
    setLoading,
} = scheduleSlice.actions;

export const scheduleReducer = scheduleSlice.reducer;

export const getSchedules = getApiGenericThunkAction(
    setLoading,
    setSchedules,
    MANAGER_API_ROUTES.schedule
);

export const scheduleObserver = makeDispatchActionWhenAuthedObserver(
    getSchedules,
    resetSchedules
);
