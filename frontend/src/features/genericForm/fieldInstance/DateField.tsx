import * as React from "react";
import * as yup from "yup";
import DatePicker from "@mui/lab/DatePicker";
import { Control } from "react-hook-form";

import { BaseFieldProps } from "./BaseFieldProps";
import GenericDatePickerField from "./GenericDatePickerField";

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
        <GenericDatePickerField
            field={field}
            control={control}
            PickerComponent={DatePicker}
            PickerComponentProps={
                {
                    //inputFormat: "MM/yyyy",
                }
            }
        />
    );
};

export default DateField;
