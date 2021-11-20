import * as React from "react";
import { Checkbox, FormGroup, FormControlLabel } from "@mui/material";
import { Control, useController } from "react-hook-form";

interface Props<Inputs> {
    field: CheckFieldData<Inputs>;
    control: Control<Inputs>;
}

const CheckField = <Inputs extends unknown>({
    field,
    control,
}: Props<Inputs>) => {
    const {
        field: { ref, value, ...inputProps },
        fieldState: { invalid, error },
    } = useController({
        name: field.name as any,
        control,
    });

    console.log("CheckField", inputProps);

    return (
        <FormGroup>
            <FormControlLabel
                control={
                    <Checkbox
                        {...inputProps}
                        checked={value as boolean}
                        ref={ref}
                    />
                }
                label={field.label}
            />
        </FormGroup>
    );
};

export default CheckField;

/**
 *
 */

export interface CheckFieldData<Inputs> {
    type: "check";
    name: keyof Inputs;
    label?: string;
}
