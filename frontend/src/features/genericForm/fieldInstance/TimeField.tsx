import * as React from "react";
import * as yup from "yup";
import TimePicker from "@mui/lab/TimePicker";
import { Control } from "react-hook-form";

import { BaseFieldProps } from "./BaseFieldProps";
import GenericDatePickerField from "./GenericDatePickerField";

/**
 *
 */

type DateYupValidationBuilderType = ReturnType<typeof yup.date>;

export interface TimeFieldData<Inputs> {
    type: "time";
    name: keyof Inputs;
    label?: string;
    validation: DateYupValidationBuilderType;
    //
    views: React.ComponentProps<typeof TimePicker>["views"];
    format: string;
}

interface TimeFieldDataProps<Inputs> extends BaseFieldProps<Inputs> {
    field: TimeFieldData<Inputs>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const TimeField = <Inputs extends unknown>({
    field,
    control,
}: TimeFieldDataProps<Inputs>) => {
    return (
        <GenericDatePickerField
            field={field}
            control={control}
            PickerComponent={TimePicker}
            PickerComponentProps={{
                ampm: false,
            }}
        />
    );
};

export default TimeField;
