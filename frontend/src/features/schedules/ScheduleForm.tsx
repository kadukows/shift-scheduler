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
    },
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

const baseUrl = "/api/schedule/";

const ScheduleForm = ({ formId, onSubmitted, objectToModify }: Props) => {
    const auth = useSelector((state: RootState) => state.authReducer);

    const defaultValues = objectToModify
        ? {
              ...objectToModify,
              month_year: parse(
                  objectToModify.month_year,
                  "MM.yyyy",
                  new Date()
              ),
          }
        : undefined;

    return (
        <GenericForm<Inputs, Workplace>
            fields={fields}
            formId={formId}
            // @ts-ignore
            defaultValues={defaultValues}
            submit={async (inputs: Inputs & { month_year: Date }) => {
                let res: AxiosResponse<Schedule> = null;

                const data = {
                    ...inputs,
                    month_year: format(inputs.month_year as Date, "MM.yyyy"),
                };

                if (!objectToModify) {
                    res = await axios.post<Schedule>(
                        baseUrl,
                        data,
                        getTokenRequestConfig(auth.token)
                    );
                } else {
                    //throw new Error("NYI");
                    res = await axios.put<Schedule>(
                        baseUrl + `${objectToModify.id}/`,
                        data,
                        getTokenRequestConfig(auth.token)
                    );
                }

                onSubmitted(res.data);
            }}
        />
    );
};

export default ScheduleForm;
