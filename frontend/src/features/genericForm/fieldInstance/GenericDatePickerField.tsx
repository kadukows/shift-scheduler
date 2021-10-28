import * as React from "react";
import * as yup from "yup";
import { Controller, Control } from "react-hook-form";
import { DateTimePicker, DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";

interface Props<Inputs> {
    PickerComponent: typeof DateTimePicker | typeof DatePicker;
    field: DatePickerFieldData<Inputs>;
    control: Control<Inputs>;
}

const GenericDatePickerField = <Inputs extends unknown>({
    PickerComponent,
    field,
    control,
}: Props<Inputs>) => {
    return (
        <Controller<Inputs>
            control={control}
            // @ts-expect-error
            name={field.name}
            render={({
                field: { onChange, value },
                fieldState: { invalid, error },
            }) => (
                <PickerComponent
                    // @ts-expect-error
                    views={field.views}
                    value={value}
                    onChange={onChange}
                    ampm={false}
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

export default GenericDatePickerField;

/**
 *
 */

type DateYupValidationBuilderType = ReturnType<typeof yup.date>;

export interface DatePickerFieldData<Inputs> {
    type: "date" | "datetime";
    name: keyof Inputs;
    label?: string;
    validation: DateYupValidationBuilderType;
    //
    views:
        | React.ComponentProps<typeof DatePicker>["views"]
        | React.ComponentProps<typeof DateTimePicker>["views"];
}
