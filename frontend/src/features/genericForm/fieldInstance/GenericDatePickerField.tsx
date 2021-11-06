import * as React from "react";
import * as yup from "yup";
import { Controller, Control } from "react-hook-form";
import { DateTimePicker, DatePicker } from "@mui/lab";
import { TextField } from "@mui/material";
//import { TIME_FORMAT } from "../../helpers";

type BaseProps =
    | React.ComponentProps<typeof DateTimePicker>
    | React.ComponentProps<typeof DatePicker>;

interface Props<Inputs> {
    PickerComponent: typeof DateTimePicker | typeof DatePicker;
    PickerComponentProps: Partial<BaseProps>;
    field: DatePickerFieldData<Inputs>;
    control: Control<Inputs>;
}

const GenericDatePickerField = <Inputs extends unknown>({
    PickerComponent,
    PickerComponentProps,
    field,
    control,
}: Props<Inputs>) => {
    return (
        <Controller<Inputs>
            control={control}
            // @ts-expect-error
            name={field.name}
            render={({
                field: { ref, ...inputProps },
                fieldState: { invalid, error },
            }) => (
                <PickerComponent
                    // @ts-expect-error
                    views={field.views}
                    inputRef={ref}
                    {...inputProps}
                    {...PickerComponentProps}
                    renderInput={(props) => (
                        <TextField
                            {...props}
                            fullWidth
                            label={field.label}
                            error={invalid}
                            // @ts-ignore
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
    inputFormat?: string;
}

// export const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";
const TIME_FORMAT = "dd/MM/yyyy HH:mm";
