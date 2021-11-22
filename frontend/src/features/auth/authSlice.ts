import {
    createSlice,
    PayloadAction,
    ThunkAction,
    AnyAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../store";
import { getTokenRequestConfig } from "../helpers";
import { GENERAL_API_ROUTES } from "../../ApiRoutes";

export interface User {
    username: string;
}

interface AuthState {
    loading: boolean;
    loaded: boolean;
    authenticated: boolean;
    token: string;
    user: User;
}

const initialState: AuthState = {
    loading: false,
    // if there is token on the local storage, than we fire an action upon site laoding
    // to load potential user from server
    // when this action ends, we can safely say that we loaded: either authenticated or not
    loaded: localStorage.getItem("token") ? false : true,
    authenticated: false,
    token: localStorage.getItem("token"),
    user: null,
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
        /*
        setAuthenticated(state, action: PayloadAction<boolean>) {
            state.authenticated = action.payload;
        },
        setToken(state, action: PayloadAction<string>) {
            localStorage.setItem("token", action.payload);
            state.token = action.payload;
        },
        */
        setUserTokenAuth(state, action: PayloadAction<UserTokenAuthPayload>) {
            state.authenticated = true;
            state.token = action.payload.token;
            state.user = action.payload.user;

            localStorage.setItem("token", action.payload.token);
        },
        resetAuth(state) {
            state.loading = false;
            state.authenticated = false;
            localStorage.removeItem("token");
            state.token = null;
            state.user = null;
        },
        setUser(state, action: PayloadAction<User>) {
            state.user = action.payload;
        },
    },
});

interface UserTokenAuthPayload {
    token: string;
    user: User;
}

export const { setLoading, setUserTokenAuth, resetAuth, setUser } =
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
            const token = getState().authReducer.token;

            const res = await axios.get<User>(
                GENERAL_API_ROUTES.user,
                getTokenRequestConfig(token)
            );

            const { username } = res.data;
            dispatch(setUserTokenAuth({ user: { username }, token }));
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
            const res = await axios.get(
                GENERAL_API_ROUTES.user,
                getTokenRequestConfig(token)
            );

            const { username } = res.data;
            dispatch(setUserTokenAuth({ user: { username }, token }));
        } catch (err) {
            dispatch(resetAuth());
        } finally {
            dispatch(setLoading(false));
        }
    };
