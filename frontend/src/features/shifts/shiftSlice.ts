import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    createSelector,
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

export interface Shift {
    id: number;
    schedule: number;
    employee: number;
    time_from: string;
    time_to: string;
    role: number;
    //
    blocked: boolean;
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
        setShifts(state, action: PayloadAction<Shift[]>) {
            // add default 'blocked' property
            for (const shift of action.payload) {
                shift.blocked = false;
            }

            return shiftAdapter.setAll(state, action);
        },
        resetShifts: shiftAdapter.removeAll,
        //
        addShift(state, action: PayloadAction<Shift>) {
            if (!("blocked" in action.payload)) {
                action.payload.blocked = false;
            }

            return shiftAdapter.addOne(state, action);
        },
        addShifts(state, action: PayloadAction<Shift[]>) {
            for (const shift of action.payload) {
                if (!("blocked" in shift)) {
                    shift.blocked = false;
                }
            }

            console.log(action.payload);

            return shiftAdapter.addMany(state, action);
        },
        //
        removeShift: shiftAdapter.removeOne,
        removeManyShift: shiftAdapter.removeMany,
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
    addShifts,
    removeShift,
    removeManyShift,
    updateShift,
    setLoading,
} = shiftSlice.actions;

export const shiftReducer = shiftSlice.reducer;

const getShifts = getApiGenericThunkAction(
    setLoading,
    setShifts,
    MANAGER_API_ROUTES.shift
);

export const shiftObserver = makeDispatchActionWhenAuthedObserver(
    getShifts,
    resetShifts
);

/**
 *
 */

interface IdsAndPropertyGetter {
    set: Set<number>;
    propertyGetter: (shift: Shift) => number;
}

const cascadeDeleteShift =
    ({
        set,
        propertyGetter,
    }: IdsAndPropertyGetter): ThunkAction<
        void,
        RootState,
        unknown,
        AnyAction
    > =>
    (dispatch, getState) => {
        const { ids, entities } = getState().shiftReducer;
        const toDeleteIds = ids.filter((id) => {
            return !set.has(propertyGetter(entities[id]));
        });
        dispatch(removeManyShift(toDeleteIds));
    };

export const deleteShiftWhenRoleDeletedObserver = observer(
    (state: RootState) => state.roleReducer.ids,
    (dispatch, current, previous) => {
        if (current.length < previous.length) {
            dispatch(
                cascadeDeleteShift({
                    set: new Set(current) as any,
                    propertyGetter: (shift) => shift.role,
                }) as any
            );
        }
    }
);

export const deleteShiftWhenEmployeeDeletedObserver = observer(
    (state: RootState) => state.employeeReducer.ids,
    (dispatch, current, previous) => {
        if (current.length < previous.length) {
            dispatch(
                cascadeDeleteShift({
                    set: new Set(current) as any,
                    propertyGetter: (shift) => shift.employee,
                }) as any
            );
        }
    }
);

export const deleteShiftWhenScheduleDeletedObserver = observer(
    (state: RootState) => state.scheduleReducer.ids,
    (dispatch, current, previous) => {
        if (current.length < previous.length) {
            dispatch(
                cascadeDeleteShift({
                    set: new Set(current) as any,
                    propertyGetter: (shift) => shift.schedule,
                }) as any
            );
        }
    }
);
