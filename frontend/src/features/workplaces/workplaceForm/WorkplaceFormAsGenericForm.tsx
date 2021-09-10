import * as React from "react";
import * as yup from "yup";

import { Workplace } from "../workplaceSlice";
import GenericForm, { Field } from "../../genericForm/GenericForm";

export interface Inputs {
    name: string;
}

interface Props {
    formId: string;
    submit: (a: Inputs) => void;
    defaultValues?: Inputs;
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
    submit,
    defaultValues,
}: Props) => {
    return (
        <GenericForm<Inputs>
            fields={fields}
            submit={submit}
            formId={formId}
            defaultValues={defaultValues ? defaultValues : undefined}
        />
    );
};

export default WorkplaceFormAsGenericForm;
