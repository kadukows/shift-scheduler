import * as React from "react";
import * as yup from "yup";

import { Workplace } from "../workplaceSlice";
import GenericForm, { Field } from "../../genericForm/GenericForm";

interface Props {
    formId: string;
    sucessfullySubmitted: (a: Workplace) => void;
}

interface Inputs {
    name: string;
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
    sucessfullySubmitted,
}: Props) => {
    return (
        <GenericForm
            fields={fields}
            apiSubmit="/api/workplace/"
            sucessfullySubmitted={sucessfullySubmitted}
            formId={formId}
        />
    );
};

export default WorkplaceFormAsGenericForm;
