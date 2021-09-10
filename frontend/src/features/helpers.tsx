import * as React from "react";
import * as ReactHookForm from "react-hook-form";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { observer } from "redux-observers";
import { ThunkAction, AnyAction } from "@reduxjs/toolkit";
import { TextField } from "@material-ui/core";

import { RootState } from "../store";

export function getTokenRequestConfig(token: string): AxiosRequestConfig {
    return {
        headers: {
            Authorization: `Token ${token}`,
        },
    };
}

/**
 * Denotes structure of errors for given "Inputs" returned by Django DRF
 */
export type DjangoErrors<Inputs> = {
    [Property in keyof Inputs]: Array<string>;
} & {
    non_field_errors: Array<string>;
};

export function handleErrors<Inputs>(
    fields: (keyof Inputs)[],
    error: AxiosError<DjangoErrors<Inputs>>["response"],
    setError: ReactHookForm.UseFormSetError<Inputs>,
    setNonFieldError: (n: string[]) => void
) {
    for (const field of fields) {
        console.log("error.data: ", error.data);
        if (field in error.data) {
            for (const msg of error.data[field]) {
                // @ts-expect-error
                setError(field, {
                    message: msg,
                });
            }
        }
    }

    if (error.data.non_field_errors) {
        setNonFieldError(error.data.non_field_errors);
    }
}

export const combineClx = (lhs: string, rhs: string) => {
    return `${lhs} ${rhs}`;
};

interface WithLastModified {
    last_modified: string;
}

export const sortByLastModified = (
    lhs: WithLastModified,
    rhs: WithLastModified
) => Date.parse(rhs.last_modified) - Date.parse(lhs.last_modified);

export const makeDispatchActionWhenAuthedObserver = (
    setAction: any,
    resetAction: any
) => {
    return observer(
        (state: RootState) => state.authReducer.authenticated,
        (dispatch, current, previous) => {
            if (previous === false && current === true) {
                dispatch(setAction());
            } else if (previous === true && current == false) {
                dispatch(resetAction());
            }
        }
    );
};

export const getApiGenericThunkAction = (
    setLoading: (a: boolean) => any,
    setEntities: (a: any) => any,
    apiUrl: string
) => {
    return (): ThunkAction<void, RootState, unknown, AnyAction> =>
        async (dispatch, getState) => {
            dispatch(setLoading(true));

            try {
                const res = await axios.get(
                    apiUrl,
                    getTokenRequestConfig(getState().authReducer.token)
                );
                dispatch(setEntities(res.data));
            } finally {
                dispatch(setLoading(false));
            }
        };
};

export interface MyTextFieldProps<Inputs> {
    errors: ReactHookForm.FormState<Inputs>["errors"];
    name: keyof Inputs;
    isSubmitting: boolean;
    register: ReactHookForm.UseFormRegister<Inputs>;
}

export function MyTextField<Inputs>({
    isSubmitting,
    register,
    name,
    errors,
    ...rest
}: Omit<React.ComponentProps<typeof TextField>, "variant"> &
    MyTextFieldProps<Inputs>) {
    return (
        // @ts-ignore
        <TextField
            variant="outlined"
            // @ts-ignore
            error={!!errors[name]}
            // @ts-ignore
            helperText={errors[name]?.message}
            fullWidth
            disabled={isSubmitting}
            label={name.charAt(0).toUpperCase() + name.slice(1)}
            {...rest}
            // @ts-ignore
            {...register(name)}
        />
    );
}
