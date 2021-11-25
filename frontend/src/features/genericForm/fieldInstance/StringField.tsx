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
    validation: any; //StringYupValidationBuilderObject;
    textFieldProps?: React.ComponentProps<typeof TextField>;
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
            {...field.textFieldProps}
            inputRef={ref}
            label={field.label ?? capitalize(field.name as any)}
            error={invalid}
            helperText={error?.message}
        />
    );
};

StringField.whyDidYouRender = {
    logOnDifferentValues: true,
    customName: "StringField",
};

export default StringField;
