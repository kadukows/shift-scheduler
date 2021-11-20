import * as React from "react";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import { FormHelperText, LinearProgress, Stack, styled } from "@mui/material";
import { format, isDate } from "date-fns";

import { DjangoErrors, handleErrors, WithId } from "../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import Field, { FieldData } from "./fieldInstance/Field";
import { BaseFieldProps } from "./fieldInstance/BaseFieldProps";

interface Props<Inputs, Entity extends WithId> {
    fields: FieldData<Inputs, Entity>[];
    submit: (a: Inputs) => void;
    formId?: string;
    defaultValues?: Partial<Inputs>;
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
        if ("validation" in field) {
            schemaBase[field.name] = (field as any).validation;
        }
    }

    const fieldNames: (keyof Inputs)[] = React.useMemo(
        () => fields.map((field) => field.name),
        [fields]
    );

    const methods = useForm<Inputs>({
        resolver: yupResolver(yup.object().shape(schemaBase)),
        // @ts-expect-error
        defaultValues,
    });

    console.log("DefaultValues: ", defaultValues);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
        control,
    } = methods;

    const onSubmit: SubmitHandler<Inputs> = React.useCallback(
        async (data) => {
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
        },
        [submit, fieldNames, setError, setNonFieldErrors]
    );

    const baseProps: BaseFieldProps<Inputs> = {
        register,
        isSubmitting,
        errors,
    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} id={formId}>
                <Stack spacing={2}>
                    {fields.map((field) => (
                        <Item key={field.name as string}>
                            <Field
                                control={control}
                                field={field}
                                {...baseProps}
                            />
                        </Item>
                    ))}
                    {isSubmitting && (
                        <Item>
                            <LinearProgress />
                        </Item>
                    )}
                    {nonFieldErrors &&
                        nonFieldErrors.map((error) => (
                            <Item key={error}>
                                <FormHelperText error>{error}</FormHelperText>
                            </Item>
                        ))}
                </Stack>
            </form>
        </FormProvider>
    );
}

export default GenericForm;

/**
 *
 */

const Item = styled("div")(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
}));

const parseDate =
    (timeFormat: string) =>
    (date: any): string => {
        return isDate(date) ? format(date, timeFormat) : date;
    };
