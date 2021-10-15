import * as React from "react";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { FormHelperText, Grid, LinearProgress } from "@material-ui/core";

import { DjangoErrors, handleErrors, WithId } from "../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import Field, { FieldData } from "./fieldInstance/Field";
import { BaseFieldProps } from "./fieldInstance/BaseFieldProps";

interface Props<Inputs, Entity extends WithId> {
    fields: FieldData<Inputs, Entity>[];
    submit: (a: any) => void;
    formId: string;
    defaultValues?: Inputs;
}

function GenericForm<Inputs, Entity extends WithId>({
    fields,
    submit,
    formId,
    defaultValues,
}: Props<Inputs, Entity>) {
    const [nonFieldErrors, setNonFieldErrors] = React.useState<string[]>([]);

    const schemaBase: any = {};
    for (const field of fields) {
        schemaBase[field.name] = field.validation;
    }

    const fieldNames: (keyof Inputs)[] = fields.map((field) => field.name);

    const methods = useForm<Inputs>({
        resolver: yupResolver(yup.object().shape(schemaBase)),
        // @ts-expect-error
        defaultValues,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        control,
    } = methods;

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await submit(data as any);
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

    const baseProps: BaseFieldProps<Inputs> = {
        register,
        isSubmitting,
        errors,
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                <Grid container direction="column" spacing={2}>
                    {fields.map((field) => (
                        <Grid item key={i++}>
                            <Field
                                control={control}
                                field={field}
                                {...baseProps}
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
        </FormProvider>
    );
}

export default GenericForm;
