import {
    createSlice,
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

interface WorkplaceState {
    //idToWorkplace: Map<number, Workplace>;
    idToWorkplace: { [id: number]: Workplace };
    loading: boolean;
}

const initialState: WorkplaceState = {
    idToWorkplace: {},
    loading: false,
};

const workplaceSlice = createSlice({
    name: "workplace",
    initialState,
    reducers: {
        addWorkplaces(state, action: PayloadAction<Workplace[]>) {
            for (const workplace of action.payload) {
                //state.idToWorkplace.set(workplace.id, workplace);
                state.idToWorkplace[workplace.id] = workplace;
            }
        },
        removeWorkplace(state, action: PayloadAction<number>) {
            //state.idToWorkplace.delete(action.payload);
            delete state.idToWorkplace[action.payload];
        },
        updateWorkplace(state, action: PayloadAction<Workplace>) {
            if (!(action.payload.id in state.idToWorkplace)) {
                throw new Error("updateWorkplace(): workplace not found");
            }

            state.idToWorkplace[action.payload.id] = action.payload;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

export const { addWorkplaces, removeWorkplace, updateWorkplace, setLoading } =
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

            dispatch(addWorkplaces(res.data));
        } catch (err) {
            console.log("Could not fetch workplaces :<");
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
