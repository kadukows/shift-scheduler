import * as React from "react";
import { useSelector } from "react-redux";
import { Controller, Control } from "react-hook-form";
import { DatePicker, DatePickerView } from "@material-ui/pickers";

import { RootState } from "../../../store";
import { WithId, MyTextField } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

/**
 * Types definitions
 */

export interface DateFieldData<Inputs> {
    type: "date";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;
    //
    views: DatePickerView[];
}

interface DateFieldDataProps<Inputs> extends BaseFieldProps<Inputs> {
    field: DateFieldData<Inputs>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const DateTimeField = <Inputs extends unknown>({
    field,
    control
}: DateFieldDataProps<Inputs>) => {
    //return <DatePicker views={} />;
    return (
        <Controller<Inputs>
            control={control}
            // @ts-ignore
            name={field.name}
            // @ts-ignore
            defaultValue=""
            render={({
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
            }) => (
                <DatePicker
                    label={field.label}
                    fullWidth
                    error={invalid}
                    helperText={error?.message}
                    views={field.views}
                />
            )}
        />
    );
};
