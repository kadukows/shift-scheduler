import * as React from "react";
import * as yup from "yup";

import GenericForm, { Field } from "../../genericForm/GenericForm";
import GenericAddOrUpdateForm from "../../genericForm/GenericAddOrUpdateForm";
import { Workplace } from "../workplaceSlice";

export interface Inputs {
    name: string;
}

interface Props {
    formId: string;
    //submit: (a: Inputs) => void;
    onSubmitted: (entity: Workplace) => void;
    objectToModify?: Workplace;
}

const fields: Field<Inputs>[] = [
    {
        type: "string",
        name: "name",
        validation: yup.string().required().min(4),
    },
];

const WorkplaceFormAsGenericForm = ({
    formId,
    onSubmitted,
    objectToModify,
}: Props) => {
    return (
        <GenericAddOrUpdateForm<Inputs, Workplace>
            fields={fields}
            baseUrl="/api/workplace/"
            onSubmitted={onSubmitted}
            formId={formId}
            objectToModify={objectToModify}
        />
    );
};

export default WorkplaceFormAsGenericForm;
