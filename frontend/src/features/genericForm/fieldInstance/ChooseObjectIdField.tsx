import { MenuItem } from "@material-ui/core";
import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

import { MyTextField, capitalize, WithId } from "../../helpers";
import {
    StringYupValidationBuilderObject,
    BaseFieldProps,
} from "./BaseFieldProps";

/**
 * Types definitions
 */

export interface ChooseObjectIdFieldData<Inputs, Entity extends WithId> {
    type: "choose_object";
    name: keyof Inputs;
    label?: string;
    validation: StringYupValidationBuilderObject;

    entitySelector: (state: RootState) => Entity[];
    entityToString: (a: Entity) => string;
}

interface ChooseObjectIdFieldProps<Inputs, Entity extends WithId>
    extends BaseFieldProps<Inputs> {
    field: ChooseObjectIdFieldData<Inputs, Entity>;
}

/**
 *  Component definition
 */

const ChooseObjectIdField = <Inputs, Entity extends WithId>({
    errors,
    register,
    isSubmitting,
    field,
}: ChooseObjectIdFieldProps<Inputs, Entity>) => {
    const entities = useSelector(field.entitySelector);

    return (
        <MyTextField<Inputs>
            errors={errors}
            name={field.name as keyof Inputs & string}
            isSubmitting={isSubmitting}
            register={register}
            label={field.label ? field.label : capitalize(field.name as string)}
            select
            value=""
        >
            {entities.map((entity) => (
                <MenuItem key={entity.id} value={entity.id}>
                    {field.entityToString(entity)}
                </MenuItem>
            ))}
        </MyTextField>
    );
};

export default ChooseObjectIdField;
