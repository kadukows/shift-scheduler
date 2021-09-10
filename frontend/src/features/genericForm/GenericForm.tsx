import * as React from "react";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { FormHelperText, Grid, LinearProgress } from "@material-ui/core";

import { RootState } from "../../store";
import {
    getTokenRequestConfig,
    DjangoErrors,
    handleErrors,
    MyTextField,
} from "../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dictionary } from "@reduxjs/toolkit";

type StringYupValidationBuilderObject = ReturnType<typeof yup["string"]>;

interface StringField<Inputs> {
    type: "string";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;
}

export type Field<Inputs> = StringField<Inputs>;

interface Props<Inputs, ReturnType> {
    fields: Field<Inputs>[];
    apiSubmit: string;
    sucessfullySubmitted: (a: ReturnType) => void;
    formId: string;
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function GenericForm<Inputs, ReturnType>({
    fields,
    apiSubmit,
    sucessfullySubmitted,
    formId,
}: Props<Inputs, ReturnType>) {
    const auth = useSelector((state: RootState) => state.authReducer);
    const [nonFieldErrors, setNonFieldErrors] = React.useState<string[]>([]);

    const schemaBase: any = {};
    for (const field of fields) {
        schemaBase[field.name] = field.validation;
    }

    const fieldNames: (keyof Inputs)[] = fields.map((field) => field.name);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<Inputs>({
        resolver: yupResolver(yup.object().shape(schemaBase)),
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await axios.post<ReturnType>(
                apiSubmit,
                data,
                getTokenRequestConfig(auth.token)
            );

            sucessfullySubmitted(res.data);
        } catch (err: any | AxiosError<DjangoErrors<Inputs>>) {
            if (axios.isAxiosError(err)) {
                const error: AxiosError<DjangoErrors<Inputs>> = err;
                if (error.response?.data) {
                    handleErrors(
                        fieldNames,
                        error.response,
                        setError,
                        setNonFieldErrors
                    );
                }
            }
        }
    };

    let i = 0;

    return (
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Grid container direction="column" spacing={2}>
                {fields.map((field) => (
                    <Grid item key={i++}>
                        <MyTextField
                            errors={errors}
                            name={field.name as any}
                            isSubmitting={isSubmitting}
                            register={register}
                            label={
                                field.label
                                    ? field.label
                                    : capitalize(field.name as string)
                            }
                        />
                    </Grid>
                ))}
                {isSubmitting && (
                    <Grid item>
                        <LinearProgress />
                    </Grid>
                )}
                {nonFieldErrors &&
                    nonFieldErrors.map((error) => (
                        <Grid item key={i++}>
                            <FormHelperText error>{error}</FormHelperText>
                        </Grid>
                    ))}
            </Grid>
        </form>
    );
}

export default GenericForm;
