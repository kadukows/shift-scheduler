import * as React from "react";
import * as yup from "yup";

import GenericForm from "../genericForm/GenericForm";
import { FieldData } from "../genericForm/fieldInstance/Field";
import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import { Employee, employeeSelectors } from "../employees/employeeSlice";
import { Workplace, workplaceSelectors } from "../workplaces/workplaceSlice";
import { Schedule } from "./scheduleSlice";

export interface Inputs {
    month_year: string;
    workplace: number;
}

interface Props {
    formId: string;
    onSubmitted: (entity: Schedule) => void;
    objectToModify?: Schedule;
}

const fields: FieldData<Inputs, Workplace>[] = [
    /*
    {
        type: "Datetime",
        name: "month_year",
        label: "Date",
        validation: yup.string().required().min(2),
    },
    */
    {
        type: "choose_object",
        name: "workplace",
        label: "Workplace",
        validation: yup.string().required(),
        //
        entitySelector: workplaceSelectors.selectAll,
        entityToString: (workplace) => workplace.name,
    },
];

const ScheduleForm = ({ formId, onSubmitted, objectToModify }: Props) => {
    return (
        <GenericAddOrUpdateForm<Inputs, Schedule, Workplace>
            fields={fields}
            baseUrl="/api/schedule/"
            onSubmitted={onSubmitted}
            formId={formId}
            objectToModify={objectToModify}
        />
    );
};

export default ScheduleForm;
