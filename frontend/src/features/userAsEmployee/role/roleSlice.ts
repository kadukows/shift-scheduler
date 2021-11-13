import {
    createSlice,
    createEntityAdapter,
    PayloadAction,
} from "@reduxjs/toolkit";
import {
    getApiGenericThunkAction,
    makeDispatchActionWhenAuthedObserver,
} from "../../helpers";
import { RootState } from "../../../store";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { Role } from "../../roles/rolesSlice";

const roleAdapter = createEntityAdapter<Role>();

interface RoleState extends ReturnType<typeof roleAdapter.getInitialState> {
    loading: boolean;
    loaded: boolean;
}

const initialState: RoleState = {
    loading: false,
    loaded: false,
    ...roleAdapter.getInitialState(),
};

const roleSlice = createSlice({
    name: "employee_role",
    initialState,
    reducers: {
        setAll: roleAdapter.setAll,
        resetAll: roleAdapter.removeAll,
        addOne: roleAdapter.addOne,
        removeOne: roleAdapter.removeOne,
        updateOne: roleAdapter.updateOne,
        //
        setLoading(state, action: PayloadAction<boolean>) {
            if (state.loading === true && action.payload === false) {
                state.loaded = true;
            }

            state.loading = action.payload;
        },
    },
});

export const roleReducer = roleSlice.reducer;
export const roleActions = roleSlice.actions;
export const roleSelectors = roleAdapter.getSelectors(
    (state: RootState) => state.employee_roleReducer
);

const getRoles = getApiGenericThunkAction(
    roleActions.setLoading,
    roleActions.setAll,
    EMPLOYEE_API_ROUTES.role
);

export const roleObserver = makeDispatchActionWhenAuthedObserver(
    getRoles,
    roleActions.resetAll
);
