import * as React from "react";
import * as yup from "yup";

import GenericForm from "../genericForm/GenericForm";
import { FieldData } from "../genericForm/fieldInstance/Field";
import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import { Employee, employeeSelectors } from "../employees/employeeSlice";
import { Workplace, workplaceSelectors } from "../workplaces/workplaceSlice";

export interface Inputs {
    first_name: string;
    last_name: string;
    workplace: number;
}

interface Props {
    formId: string;
    onSubmitted: (entity: Employee) => void;
    objectToModify?: Employee;
}

const fields: FieldData<Inputs, Workplace>[] = [
    {
        type: "string",
        name: "first_name",
        label: "First name",
        validation: yup.string().required().min(2),
    },
    {
        type: "string",
        name: "last_name",
        label: "Last name",
        validation: yup.string().required().min(2),
    },
    {
        type: "choose_object",
        name: "workplace",
        label: "Workplace",
        validation: yup.number().required(),
        //
        entitySelector: workplaceSelectors.selectAll,
        entityToString: (workplace) => workplace.name,
    } as FieldData<Inputs, Workplace>,
];

const EmployeeForm = ({ formId, onSubmitted, objectToModify }: Props) => {
    return (
        <GenericAddOrUpdateForm<Inputs, Employee, Workplace>
            fields={fields}
            baseUrl="/api/employee/"
            onSubmitted={onSubmitted}
            formId={formId}
            objectToModify={objectToModify}
        />
    );
};

export default EmployeeForm;
