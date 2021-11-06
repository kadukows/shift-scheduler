import * as React from "react";
import * as ReactHookForm from "react-hook-form";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { observer } from "redux-observers";
import { ThunkAction, AnyAction } from "@reduxjs/toolkit";
import { TextField } from "@mui/material";

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

export const getApiGenericThunkAction =
    (
        setLoading: (a: boolean) => any,
        setEntities: (a: any) => any,
        apiUrl: string
    ) =>
    (): ThunkAction<void, RootState, unknown, AnyAction> =>
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

type MyTextFieldProps<Inputs> = {
    errors: ReactHookForm.FormState<Inputs>["errors"];
    name: keyof Inputs;
    isSubmitting: boolean;
    register: ReactHookForm.UseFormRegister<Inputs>;
} & Omit<React.ComponentProps<typeof TextField>, "variant">;

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function MyTextField<Inputs>({
    isSubmitting,
    register,
    name,
    errors,
    children,
    ...rest
}: React.PropsWithChildren<MyTextFieldProps<Inputs>>) {
    return (
        <TextField
            variant="outlined"
            error={(name as keyof Inputs) in errors}
            // @ts-expect-error
            helperText={errors[name as keyof Inputs]?.message}
            fullWidth
            disabled={isSubmitting}
            {...rest}
            // @ts-ignore
            {...register(name)}
        >
            {children}
        </TextField>
    );
}

export interface WithId {
    id: number;
}

export const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";


export const useEffectWithoutFirst = (effect: () => void, deps: React.DependencyList) => {
    const isFirst = React.useRef(true);

    React.useEffect(() => {
        if (isFirst.current) {
            isFirst.current = false;
        } else {
            effect();
        }
    }, deps);
}