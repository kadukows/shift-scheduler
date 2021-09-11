import * as React from "react";
import { MyTextField, capitalize } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

/**
 * Types definitions
 */

export interface StringFieldData<Inputs> {
    type: "string";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;
}

interface StringFieldProps<Inputs> extends BaseFieldProps<Inputs> {
    field: StringFieldData<Inputs>;
}

/**
 *  Component definition
 */

const StringField = <Inputs extends unknown>({
    errors,
    register,
    isSubmitting,
    field,
}: StringFieldProps<Inputs>) => {
    return (
        <MyTextField<Inputs>
            errors={errors}
            name={field.name as keyof Inputs & string}
            isSubmitting={isSubmitting}
            register={register}
            label={field.label ? field.label : capitalize(field.name as string)}
        />
    );
};

export default StringField;
