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
//const defaultVal = new Date("01/01/1999");

const DateField = <Inputs extends unknown>({
    field,
    control,
}: DateFieldDataProps<Inputs>) => {
    //return <DatePicker views={} />;
    return (
        <Controller<Inputs>
            control={control}
            // @ts-ignore
            name={field.name}
            // @ts-ignore
            //defaultValue={defaultVal}
            render={({
                field: { onChange, value, name, ref },
                fieldState: { invalid, error },
            }) => (
                <DatePicker
                    views={field.views}
                    ref={ref}
                    value={value}
                    onChange={onChange}
                    inputFormat={field.format}
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

export default DateField;
