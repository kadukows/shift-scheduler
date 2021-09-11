import * as React from "react";
import * as yup from "yup";
import axios, { AxiosError } from "axios";
import {
    useForm,
    SubmitHandler,
    UseFormStateReturn,
    FormState,
    UseFormRegister,
} from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import {
    FormHelperText,
    Grid,
    LinearProgress,
    MenuItem,
} from "@material-ui/core";

import { RootState } from "../../store";
import {
    getTokenRequestConfig,
    DjangoErrors,
    handleErrors,
    MyTextField,
    WithId,
} from "../helpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { Dictionary } from "@reduxjs/toolkit";

type StringYupValidationBuilderObject = ReturnType<typeof yup["string"]>;
type NumberYupValidationBuilderObject = ReturnType<typeof yup["number"]>;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface BaseFieldProps<Inputs> {
    errors: FormState<Inputs>["errors"];
    register: UseFormRegister<Inputs>;
    isSubmitting: boolean;
}

interface StringField<Inputs> {
    type: "string";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;
}

interface StringFieldProps<Inputs> extends BaseFieldProps<Inputs> {
    field: StringField<Inputs>;
}

const StringFieldInstance = <Inputs extends unknown>({
    errors,
    register,
    isSubmitting,
    field,
}: StringFieldProps<Inputs>) => {
    return (
        <MyTextField<Inputs>
            errors={errors}
            name={field.name as keyof Inputs & string}
            isSubmitting={isSubmitting}
            register={register}
            label={field.label ? field.label : capitalize(field.name as string)}
        />
    );
};

interface ChooseObjectIdField<Inputs, Entity extends WithId> {
    type: "choose_object";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;

    entitySelector: (state: RootState) => Entity[];
    entityToString: (a: Entity) => string;
}

interface ChooseObjectIdFieldProps<Inputs, Entity extends WithId>
    extends BaseFieldProps<Inputs> {
    field: ChooseObjectIdField<Inputs, Entity>;
}

const ChooseObjectIdFieldInstance = <Inputs, Entity extends WithId>({
    errors,
    register,
    isSubmitting,
    field,
}: ChooseObjectIdFieldProps<Inputs, Entity>) => {
    const entities = useSelector(field.entitySelector);

    return (
        <MyTextField<Inputs>
            errors={errors}
            name={field.name as keyof Inputs & string}
            isSubmitting={isSubmitting}
            register={register}
            label={field.label ? field.label : capitalize(field.name as string)}
            select
            value=""
        >
            {entities.map((entity) => (
                <MenuItem key={entity.id} value={entity.id}>
                    {field.entityToString(entity)}
                </MenuItem>
            ))}
        </MyTextField>
    );
};

export type Field<Inputs, Entity extends WithId> =
    | StringField<Inputs>
    | ChooseObjectIdField<Inputs, Entity>;

interface FieldInstanceProps<Inputs, Entity extends WithId>
    extends BaseFieldProps<Inputs> {
    field: Field<Inputs, Entity>;
}

const FieldInstance = <Inputs, Entity extends WithId>({
    field,
    errors,
    isSubmitting,
    register,
}: FieldInstanceProps<Inputs, Entity>) => {
    const baseProps: BaseFieldProps<Inputs> = {
        register,
        errors,
        isSubmitting,
    };

    switch (field.type) {
        case "string":
            const stringField = field as StringField<Inputs>;
            return <StringFieldInstance field={stringField} {...baseProps} />;

        case "choose_object":
            const chooseObjectField = field as ChooseObjectIdField<
                Inputs,
                Entity
            >;
            return (
                <ChooseObjectIdFieldInstance
                    field={chooseObjectField}
                    {...baseProps}
                />
            );
    }

    return <></>;
};

interface Props<Inputs, Entity extends WithId> {
    fields: Field<Inputs, Entity>[];
    submit: (a: Inputs) => void;
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

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<Inputs>({
        resolver: yupResolver(yup.object().shape(schemaBase)),
        // @ts-expect-error
        defaultValues,
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await submit(data as unknown as Inputs);
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
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Grid container direction="column" spacing={2}>
                {fields.map((field) => (
                    <Grid item key={i++}>
                        <FieldInstance field={field} {...baseProps} />
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
