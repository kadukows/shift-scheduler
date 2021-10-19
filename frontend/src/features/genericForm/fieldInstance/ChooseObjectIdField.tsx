import { MenuItem, TextField } from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { Controller, Control, useFormContext } from "react-hook-form";

import { RootState } from "../../../store";
import { MyTextField, capitalize, WithId } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

/**
 * Types definitions
 */

export interface ChooseObjectIdFieldData<Inputs, Entity extends WithId> {
    type: "choose_object";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;

    entitySelector: (state: RootState, getValues: any) => Entity[];
    entityToString: (a: Entity) => string;
}

interface ChooseObjectIdFieldProps<Inputs, Entity extends WithId>
    extends BaseFieldProps<Inputs> {
    field: ChooseObjectIdFieldData<Inputs, Entity>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const ChooseObjectIdField = <Inputs, Entity extends WithId>({
    field,
    control,
}: ChooseObjectIdFieldProps<Inputs, Entity>) => {
    const { getValues } = useFormContext();
    const entities = useSelector((state: RootState) =>
        field.entitySelector(state, getValues)
    );

    return (
        <Controller
            control={control}
            // @ts-expect-error
            name={field.name}
            // @ts-ignore
            defaultValue=""
            render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
            }) => (
                <TextField
                    variant="outlined"
                    label={field.label}
                    fullWidth
                    error={invalid}
                    //@ts-ignore
                    helperText={error?.message}
                    onChange={onChange}
                    value={value}
                    select
                >
                    {entities.map((entity) => (
                        <MenuItem key={entity.id} value={entity.id}>
                            {field.entityToString(entity)}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};

export default ChooseObjectIdField;
