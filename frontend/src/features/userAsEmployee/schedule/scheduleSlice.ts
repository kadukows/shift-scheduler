import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../../helpers";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { RootState } from "../../../store";
import { Schedule } from "../../schedules/scheduleSlice";

/**
 *
 *
 *
 *
 */

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
    name: "employee_schedule",
    initialState,
    reducers: {
        setAll: scheduleAdapter.setAll,
        resetAll: scheduleAdapter.removeAll,
        addOne: scheduleAdapter.addOne,
        updateOne: scheduleAdapter.updateOne,
        removeOne: scheduleAdapter.removeOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export type { Schedule };
export const scheduleReducer = scheduleSlice.reducer;
export const scheduleActions = scheduleSlice.actions;
export const scheduleSelectors = scheduleAdapter.getSelectors(
    (state: RootState) => state.employee_scheduleReducer
);

export const getSchedules = getApiGenericThunkAction(
    scheduleActions.setLoading,
    scheduleActions.setAll,
    EMPLOYEE_API_ROUTES.schedule
);

export const scheduleObserver = makeDispatchActionWhenAuthedObserver(
    getSchedules,
    scheduleActions.resetAll
);
