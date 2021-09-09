import * as ReactHookForm from "react-hook-form";
import { AxiosRequestConfig, AxiosError } from "axios";

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
