import * as React from "react";
import * as yup from "yup";
import { Controller, Control } from "react-hook-form";
import { TextField } from "@mui/material";
import { DateTimePicker, DateTimePickerProps } from "@mui/lab";
import { parse, format } from "date-fns";

import { BaseFieldProps } from "./BaseFieldProps";

/**
 * Types definitions
 */

type DateYupValidationBuilderType = ReturnType<typeof yup.string>;

export interface DateTimeFieldData<Inputs> {
    type: "datetime";
    name: keyof Inputs;
    label?: string;
    validation: DateYupValidationBuilderType;
    //
    views: DateTimePickerProps["views"];
    format: string;
}

interface Props<Inputs> extends BaseFieldProps<Inputs> {
    field: DateTimeFieldData<Inputs>;
    control: Control<Inputs>;
}

const DateTimeField = <Inputs extends unknown>({
    field,
    control,
}: Props<Inputs>) => {
    return (
        <Controller<Inputs>
            control={control}
            // @ts-expect-error
            name={field.name}
            render={({
                field: { onChange, value, name, ref },
                fieldState: { invalid, error },
            }) => (
                <DateTimePicker
                    views={field.views}
                    ref={ref}
                    inputFormat={field.format}
                    value={parse(value, field.format, new Date())}
                    onChange={(val: Date) =>
                        onChange(format(val, field.format))
                    }
                    ampm={false}
                    renderInput={(props) => (
                        <TextField
                            fullWidth
                            name={name}
                            label={field.label}
                            error={invalid}
                            helperText={error?.message}
                            {...props}
                        />
                    )}
                />
            )}
        />
    );
};

export default DateTimeField;
