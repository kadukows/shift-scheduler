import * as React from "react";
import * as yup from "yup";
import { Controller, Control } from "react-hook-form";
import { TextField } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { parse, format } from "date-fns";

import { BaseFieldProps } from "./BaseFieldProps";

/**
 * Types definitions
 */

type DateYupValidationBuilderType = ReturnType<typeof yup.date>;

export interface DateFieldData<Inputs> {
    type: "date";
    name: keyof Inputs;
    label?: string;
    // this validates date as string
    validation: DateYupValidationBuilderType;
    //
    views: React.ComponentProps<typeof DatePicker>["views"];
    format: string;
}

interface DateFieldDataProps<Inputs> extends BaseFieldProps<Inputs> {
    field: DateFieldData<Inputs>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const DateField = <Inputs extends unknown>({
    field,
    control,
}: DateFieldDataProps<Inputs>) => {
    return (
        <Controller<Inputs>
            control={control}
            // @ts-expect-error
            name={field.name}
            render={({
                field: { onChange, value, name, ref },
                fieldState: { invalid, error },
            }) => (
                <DatePicker
                    views={field.views}
                    //ref={ref}
                    value={parse(value, field.format, new Date())}
                    onChange={(val: Date) =>
                        onChange(format(val, field.format))
                    }
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            fullWidth
                            label={field.label}
                            error={invalid}
                            helperText={error?.message}
                        />
                    )}
                />
            )}
        />
    );
};

export default DateField;
