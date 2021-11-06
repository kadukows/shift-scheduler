import * as React from "react";
import { TextField } from "@mui/material";
import { Control, useController, Controller } from "react-hook-form";
import { MyTextField, capitalize } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

/**
 * Types definitions
 */

export interface StringFieldData<Inputs> {
    type: "string";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;
}

interface StringFieldProps<Inputs> {
    field: StringFieldData<Inputs>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const StringField = <Inputs extends unknown>({
    field,
    control,
}: StringFieldProps<Inputs>) => {
    /*
    return (
        <MyTextField<Inputs>
            errors={errors}
            name={field.name as keyof Inputs & string}
            isSubmitting={isSubmitting}
            register={register}
            label={field.label ? field.label : capitalize(field.name as string)}
        />
    );
    */
    const {
        field: { ref, onBlur, ...inputProps },
        fieldState: { invalid, error },
    } = useController({
        name: field.name as any,
        control,
    });

    return (
        <TextField
            {...inputProps}
            inputRef={ref}
            label={field.label ?? capitalize(field.name as any)}
            error={invalid}
            helperText={error?.message}
        />
    );
};

export default StringField;
