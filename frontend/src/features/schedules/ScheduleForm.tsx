import * as React from "react";
import * as yup from "yup";
import axios, { AxiosResponse } from "axios";
import { format, parse } from "date-fns";

import GenericForm from "../genericForm/GenericForm";
import { FieldData } from "../genericForm/fieldInstance/Field";
import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import { Employee, employeeSelectors } from "../employees/employeeSlice";
import { Workplace, workplaceSelectors } from "../workplaces/workplaceSlice";
import { Schedule } from "./scheduleSlice";
import { getTokenRequestConfig } from "../helpers";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

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
    {
        type: "date",
        name: "month_year",
        label: "Date",
        validation: yup.date().required(),
        //
        views: ["month", "year"],
        format: "MM.yyyy",
    },
    {
        type: "choose_object",
        name: "workplace",
        label: "Workplace",
        validation: yup.number().required(),
        //
        entitySelector: workplaceSelectors.selectAll,
        entityToString: (workplace) => workplace.name,
    },
];

const ScheduleForm = (props: Props) => {
    return (
        <GenericAddOrUpdateForm
            fields={fields}
            baseUrl="/api/schedule/"
            {...props}
        />
    );
};

export default ScheduleForm;
