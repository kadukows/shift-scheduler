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

export interface Role {
    id: number;
    name: string;
    workplace: number;
}

const roleAdapter = createEntityAdapter<Role>();

interface RoleState extends ReturnType<typeof roleAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState = {
    loading: false,
    loaded: false,
    ...roleAdapter.getInitialState(),
};

const roleSlice = createSlice({
    name: "role",
    initialState,
    reducers: {
        setRoles: roleAdapter.setAll,
        resetRoles: roleAdapter.removeAll,
        //
        addRole: roleAdapter.addOne,
        removeRole: roleAdapter.removeOne,
        updateRole: roleAdapter.updateOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const roleSelectors = roleAdapter.getSelectors(
    (state: RootState) => state.roleReducer
);

export const {
    setRoles,
    resetRoles,
    addRole,
    removeRole,
    updateRole,
    setLoading,
} = roleSlice.actions;

export const roleReducer = roleSlice.reducer;

const getRoles = getApiGenericThunkAction(setLoading, setRoles, "/api/role/");

export const roleObserver = makeDispatchActionWhenAuthedObserver(
    getRoles,
    resetRoles
);
