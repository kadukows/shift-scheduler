import {
    createSlice,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import { RootState } from "../../store";
import { getTokenRequestConfig } from "../helpers";

interface AuthState {
    loading: boolean;
    loaded: boolean;
    authenticated: boolean;
    token: string;
}

const initialState: AuthState = {
    loading: false,
    // if there is token on the local storage, than we fire an action upon site laoding
    // to load potential user from server
    // when this action ends, we can safely say that we loaded: either authenticated or not
    loaded: localStorage.getItem("token") ? false : true,
    authenticated: false,
    token: localStorage.getItem("token"),
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setLoading(state, action: PayloadAction<boolean>) {
            // safe to assume that we loaded, either authenticated or not
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.authenticated = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            localStorage.setItem("token", action.payload);
            state.token = action.payload;
        },
        resetAuth(state) {
            state.loading = false;
            state.authenticated = false;
            localStorage.removeItem("token");
            state.token = null;
        },
    },
});

export const { setLoading, setAuthenticated, setToken, resetAuth } =
    authSlice.actions;
export const authReducer = authSlice.reducer;

function canAuthProcessBeInstantiated(state: AuthState): boolean {
    return !state.authenticated && state.token !== null && !state.loading;
}

export const tryAuthWithCurrentToken =
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        if (!canAuthProcessBeInstantiated(getState().authReducer)) {
            return;
        }

        dispatch(setLoading(true));

        try {
            const user = await axios.get(
                "/api/user/",
                getTokenRequestConfig(getState().authReducer.token)
            );
            // download workplaces, emplyees, schedules and shifts
            dispatch(setAuthenticated(true));
        } catch (err) {
            dispatch(resetAuth());
        } finally {
            dispatch(setLoading(false));
        }
    };

export const tryAuthWithToken =
    (token: string): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        if (getState().authReducer.loading) {
            return;
        }

        dispatch(setLoading(true));

        try {
            const user = await axios.get(
                "/api/user/",
                getTokenRequestConfig(token)
            );
            dispatch(setToken(token));
            // download workplaces, emplyees, schedules and shifts
            dispatch(setAuthenticated(true));
        } catch (err) {
            dispatch(resetAuth());
        } finally {
            dispatch(setLoading(false));
        }
    };
