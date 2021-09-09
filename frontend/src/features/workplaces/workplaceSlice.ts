import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { observer } from "redux-observers";

import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";

interface Workplace {
    id: number;
    name: string;
    last_modified: string;
}

const workplaceAdapter = createEntityAdapter<Workplace>({
    sortComparer: (lhs, rhs) =>
        Date.parse(rhs.last_modified) - Date.parse(lhs.last_modified),
});

interface WorkplaceState
    extends ReturnType<typeof workplaceAdapter.getInitialState> {
    loading: boolean;
}

const initialState: WorkplaceState = {
    loading: false,
    ...workplaceAdapter.getInitialState(),
};

const workplaceSlice = createSlice({
    name: "workplace",
    initialState,
    reducers: {
        setWorkplaces: workplaceAdapter.setAll,
        removeWorkplace: workplaceAdapter.removeOne,
        updateWorkplace: workplaceAdapter.updateOne,
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { setWorkplaces, removeWorkplace, updateWorkplace, setLoading } =
    workplaceSlice.actions;
export const workplaceReducer = workplaceSlice.reducer;

export const getWorkplaces =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        dispatch(setLoading(true));

        try {
            const res = await axios.get<Workplace[]>(
                "/api/workplace/",
                getTokenRequestConfig(getState().authReducer.token)
            );

            dispatch(setWorkplaces(res.data));
        } finally {
            dispatch(setLoading(false));
        }
    };

export const workplaceObserver = observer(
    (state: RootState) => state.authReducer.authenticated,
    (dispatch, current, previous) => {
        // i.e. user has logged in
        if (previous === false && current === true) {
            // @ts-expect-error
            dispatch(getWorkplaces());
        }
    }
);
