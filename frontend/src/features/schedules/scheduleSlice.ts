import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import {
    getApiGenericThunkAction,
    getTokenRequestConfig,
    makeDispatchActionWhenAuthedObserver,
} from "../helpers";
import { RootState } from "../../store";
import { MANAGER_API_ROUTES } from "../../ApiRoutes";
import {
    addShifts,
    removeManyShift,
    resetShifts,
    Shift,
} from "../shifts/shiftSlice";
import { format, parse } from "date-fns";
import { addAlert } from "../alerts/alertsSlice";

export interface Schedule {
    id: number;
    workplace: number;
    month_year: string;
    published: boolean;
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

export const runSolverDefault =
    (
        scheduleId: number,
        days: Date[]
    ): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        const state = getState();

        const schedule = state.scheduleReducer.entities[scheduleId];
        const employees = state.employeeReducer.ids
            .map((id) => state.employeeReducer.entities[id])
            .filter((e) => e.workplace === schedule.workplace);
        const roles = state.roleReducer.ids
            .map((id) => state.roleReducer.entities[id])
            .filter((r) => r.workplace === schedule.workplace);

        try {
            const res = await axios.post<Shift[]>(
                MANAGER_API_ROUTES.scheduleRunSolver(schedule.id),
                {
                    employees: employees.map((e) => e.id),
                    roles: roles.map((r) => r.id),
                    days: days.map((d) => format(d, "yyyy-MM-dd")),
                    tz_info: Intl.DateTimeFormat().resolvedOptions().timeZone,
                },
                getTokenRequestConfig(state.authReducer.token)
            );

            dispatch(addShifts(res.data));
            dispatch(
                addAlert({
                    type: "success",
                    message: "Sucessfully ran solver!",
                })
            );
        } catch (e) {
            dispatch(
                addAlert({
                    type: "warning",
                    message: "Something went wrong",
                })
            );
        }
    };

export const clearShiftsForSchedule =
    (scheduleId: number): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        try {
            await axios.delete(
                MANAGER_API_ROUTES.scheduleClear(scheduleId),
                getTokenRequestConfig(getState().authReducer.token)
            );

            const shiftR = getState().shiftReducer;
            const shiftsToDelete = shiftR.ids
                .map((id) => shiftR.entities[id])
                .filter((s) => s.schedule === scheduleId);

            dispatch(removeManyShift(shiftsToDelete.map((s) => s.id)));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Cleared shifts`,
                })
            );
        } catch (e) {
            dispatch(
                addAlert({
                    type: "warning",
                    message: "Something went wrong",
                })
            );
        }
    };
