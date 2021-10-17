import * as React from "react";
import * as yup from "yup";
import { Controller, Control } from "react-hook-form";
import { DateTimePicker, DateTimePickerView } from "@material-ui/pickers";
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
    views: DateTimePickerView[];
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
                    label={field.label}
                    fullWidth
                    error={invalid}
                    helperText={error?.message}
                    views={field.views}
                    ref={ref}
                    name={name}
                    value={parse(value, field.format, new Date())}
                    onChange={(date: Date) =>
                        onChange(format(date, field.format))
                    }
                    ampm={false}
                />
            )}
        />
    );
};

export default DateTimeField;
