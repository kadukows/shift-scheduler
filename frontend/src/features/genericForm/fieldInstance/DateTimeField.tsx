import * as React from "react";
import * as yup from "yup";
import { Control } from "react-hook-form";
import { DateTimePicker, DateTimePickerProps } from "@mui/lab";

import { BaseFieldProps } from "./BaseFieldProps";
import GenericDatePicker from "./GenericDatePickerField";
import GenericDatePickerField from "./GenericDatePickerField";

/**
 * Types definitions
 */

type DateYupValidationBuilderType = ReturnType<typeof yup.date>;

export interface DateTimeFieldData<Inputs> {
    type: "datetime";
    name: keyof Inputs;
    label?: string;
    validation: DateYupValidationBuilderType;
    //
    views: DateTimePickerProps["views"];
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
        <GenericDatePickerField
            field={field}
            control={control}
            PickerComponent={DateTimePicker}
            PickerComponentProps={{
                ampm: false,
                ampmInClock: false,
                inputFormat: "dd/MM/yyyy HH:mm",
            }}
        />
    );
};

export default DateTimeField;
