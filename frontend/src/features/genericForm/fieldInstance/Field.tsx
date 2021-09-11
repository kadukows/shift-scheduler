import * as React from "react";
import { Control } from "react-hook-form";

import { WithId } from "../../helpers";
import StringField, { StringFieldData } from "./StringField";
import ChooseObjectIdField, {
    ChooseObjectIdFieldData,
} from "./ChooseObjectIdField";
import { BaseFieldProps } from "./BaseFieldProps";

/**
 * Types definitions
 */

export type FieldData<Inputs, Entity extends WithId> =
    | StringFieldData<Inputs>
    | ChooseObjectIdFieldData<Inputs, Entity>;

interface FieldInstanceProps<Inputs, Entity extends WithId>
    extends BaseFieldProps<Inputs> {
    field: FieldData<Inputs, Entity>;
    control: Control<Inputs>;
}

/**
 *  Component definition
 */

const Field = <Inputs, Entity extends WithId>({
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
            return <StringField field={stringField} {...baseProps} />;

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
    }

    return <></>;
};

export default Field;