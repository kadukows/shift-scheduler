import * as React from "react";
import * as yup from "yup";
import { useSelector } from "react-redux";
import { Controller, Control } from "react-hook-form";
import { DatePicker, DatePickerView } from "@material-ui/pickers";
//import {} from "date-fns"

import { RootState } from "../../../store";
import { WithId, MyTextField } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

type DateYupValidationBuilderType = ReturnType<typeof yup.date>;

/**
 * Types definitions
 */

export interface DateFieldData<Inputs> {
    type: "date";
    name: keyof Inputs;
    label?: string;
    validation: DateYupValidationBuilderType;
    //
    views: DatePickerView[];
    format?: string;
}

interface DateFieldDataProps<Inputs> extends BaseFieldProps<Inputs> {
    field: DateFieldData<Inputs>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */
const defaultVal = new Date("01/01/1999");

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
                field: { onChange, onBlur, value, name, ref },
                fieldState: { invalid, isTouched, isDirty, error },
            }) => {
                console.log("value", value);

                return (
                    <DatePicker
                        label={field.label}
                        fullWidth
                        error={invalid}
                        helperText={error?.message}
                        views={field.views}
                        value={value}
                        onChange={onChange}
                    />
                );
            }}
        />
    );
};

export default DateField;
