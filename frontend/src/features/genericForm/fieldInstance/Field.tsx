import * as React from "react";
import { Control } from "react-hook-form";

import { WithId } from "../../helpers";
import StringField, { StringFieldData } from "./StringField";
import ChooseObjectIdField, {
    ChooseObjectIdFieldData,
} from "./ChooseObjectIdField";
import DateField, { DateFieldData } from "./DateField";
import DateTimeField, { DateTimeFieldData } from "./DateTimeField";
import CheckField, { CheckFieldData } from "./CheckField";
import { BaseFieldProps } from "./BaseFieldProps";
import DateTimeRangeField, {
    DateTimeRangeFieldData,
} from "./DateTimeRangeField";
import TimeField, { TimeFieldData } from "./TimeField";

/**
 * Types definitions
 */

export type FieldData<Inputs, Entity> =
    | StringFieldData<Inputs>
    | ChooseObjectIdFieldData<Inputs, Entity>
    | DateFieldData<Inputs>
    | DateTimeFieldData<Inputs>
    | CheckFieldData<Inputs>
    | DateTimeRangeFieldData<Inputs>
    | TimeFieldData<Inputs>;

interface FieldInstanceProps<Inputs, Entity> extends BaseFieldProps<Inputs> {
    field: FieldData<Inputs, Entity>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const Field = <Inputs, Entity>({
    field,
    errors,
    isSubmitting,
    register,
    control,
}: FieldInstanceProps<Inputs, Entity>) => {
    const baseProps: BaseFieldProps<Inputs> = {
        register,
        errors,
        isSubmitting,
    };

    switch (field.type) {
        case "string":
            const stringField = field as StringFieldData<Inputs>;
            return (
                <StringField<Inputs> field={stringField} control={control} />
            );

        case "choose_object":
            const chooseObjectField = field as ChooseObjectIdFieldData<
                Inputs,
                Entity
            >;
            return (
                <ChooseObjectIdField
                    field={chooseObjectField}
                    control={control}
                    {...baseProps}
                />
            );

        case "date":
            const dateField = field as DateFieldData<Inputs>;
            return (
                <DateField field={dateField} control={control} {...baseProps} />
            );

        case "datetime":
            const dateTimeField = field as DateTimeFieldData<Inputs>;
            return (
                <DateTimeField
                    field={dateTimeField}
                    control={control}
                    {...baseProps}
                />
            );

        case "check":
            const checkFieldData = field as CheckFieldData<Inputs>;
            return <CheckField field={checkFieldData} control={control} />;

        case "datetime_range":
            const dateTimeRangeFieldData =
                field as DateTimeRangeFieldData<Inputs>;
            return (
                <DateTimeRangeField
                    field={dateTimeRangeFieldData}
                    control={control}
                />
            );

        case "time":
            const timeFieldData = field as TimeFieldData<Inputs>;
            return (
                <TimeField
                    field={timeFieldData}
                    control={control}
                    {...baseProps}
                />
            );
    }

    return <React.Fragment />;
};

export default Field;
