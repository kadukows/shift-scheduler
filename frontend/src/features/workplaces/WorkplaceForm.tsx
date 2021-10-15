import * as React from "react";
import * as yup from "yup";

import GenericForm from "../genericForm/GenericForm";
import { FieldData } from "../genericForm/fieldInstance/Field";
import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import { Workplace } from "./workplaceSlice";

export interface Inputs {
    name: string;
}

interface Props {
    formId: string;
    onSubmitted: (entity: Workplace) => void;
    objectToModify?: Workplace;
}

const fields: FieldData<Inputs, Workplace>[] = [
    {
        type: "string",
        name: "name",
        validation: yup.string().required().min(4),
    },
];

const WorkplaceForm = ({ formId, onSubmitted, objectToModify }: Props) => {
    return (
        <GenericAddOrUpdateForm<Inputs, Workplace, any>
            fields={fields}
            baseUrl="/api/workplace/"
            onSubmitted={onSubmitted}
            formId={formId}
            objectToModify={objectToModify}
        />
    );
};

export default WorkplaceForm;
