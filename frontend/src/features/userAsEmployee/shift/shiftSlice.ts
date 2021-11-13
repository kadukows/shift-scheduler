import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import { observer } from "redux-observers";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../../helpers";
import { RootState } from "../../../store";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { Shift } from "../../shifts/shiftSlice";

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
    name: "employee_shift",
    initialState,
    reducers: {
        setAll(state, action: PayloadAction<Shift[]>) {
            // add default 'blocked' property
            for (const shift of action.payload) {
                shift.blocked = false;
            }

            return shiftAdapter.setAll(state, action);
        },
        resetAll: shiftAdapter.removeAll,
        addOne(state, action: PayloadAction<Shift>) {
            if (!("blocked" in action.payload)) {
                action.payload.blocked = false;
            }

            return shiftAdapter.addOne(state, action);
        },
        removeOne: shiftAdapter.removeOne,
        removeMany: shiftAdapter.removeMany,
        updateOne: shiftAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const shiftReducer = shiftSlice.reducer;
export const shiftActions = shiftSlice.actions;
export const shiftSelectors = shiftAdapter.getSelectors(
    (state: RootState) => state.employee_shiftReducer
);

const getShifts = getApiGenericThunkAction(
    shiftActions.setLoading,
    shiftActions.setAll,
    EMPLOYEE_API_ROUTES.shift
);

export const shiftObserver = makeDispatchActionWhenAuthedObserver(
    getShifts,
    shiftActions.resetAll
);
