import { Update, ThunkAction, AnyAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { RootState } from "../../store";
import { addAlert } from "../alerts/alertsSlice";
import { getTokenRequestConfig } from "../helpers";
import { Shift, updateShift } from "./shiftSlice";

export const asyncUpdateShift =
    (update: Update<Shift>): ThunkAction<void, RootState, unknown, AnyAction> =>
    async (dispatch, getState) => {
        console.log("asyncUpdateShift()");

        dispatch(updateShift({ id: update.id, changes: { blocked: true } }));

        let res: AxiosResponse<Shift> = null;

        try {
            const { blocked, ...oldShift } =
                getState().shiftReducer.entities[update.id];
            const token = getState().authReducer.token;

            res = await axios.put<Shift>(
                `/api/shift/${update.id}/`,
                {
                    ...oldShift,
                    ...update.changes,
                },
                getTokenRequestConfig(token)
            );

            dispatch(
                updateShift({
                    id: update.id,
                    changes: { ...res.data, blocked: false },
                })
            );
            dispatch(
                addAlert({
                    type: "success",
                    message: `Successfully updated shift: ${update.id}`,
                })
            );
        } catch (e) {
            dispatch(
                addAlert({
                    type: "warning",
                    message: `Error when updating shift: ${update.id}`,
                })
            );

            dispatch(
                updateShift({
                    id: update.id,
                    changes: {
                        blocked: false,
                    },
                })
            );
        }
    };
