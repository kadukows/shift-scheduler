/*
import * as React from "react";
import * as yup from "yup";

import GenericForm from "../../genericForm/GenericForm";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import GenericAddOrUpdateForm from "../../genericForm/GenericAddOrUpdateForm";
import { Shift } from "../../shifts/shiftSlice";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup.js";
import { Schedule, scheduleSelectors } from "../../schedules/scheduleSlice";
import { Workplace, workplaceSelectors } from "../../workplaces/workplaceSlice";
import { Employee } from "../../employees/employeeSlice";
import { RootState } from "../../../store";

export interface Inputs {
    schedule: number;
    employee: number;
    role: number;
    time_from: string;
    time_to: string;
}

interface Props {
    formId: string;
    onSubmitted: (entity: Shift) => void;
    objectToModiy?: Shift;
}

const scheduleByWorkplaceSelector = (
    state: RootState,
    getValues: any
): Schedule[] => {
    const workplace: number = getValues("workplace");
    if (!workplace) {
        return [];
    }

    const schedules = scheduleSelectors.selectAll(state);
    return schedules.filter((schedule) => schedule.workplace === workplace);
};

const fiels: FieldData<Inputs, Schedule | Workplace | Employee>[] = [
    {
        type: "choose_object",
        name: "workplace",
        label: "Workplace",
        validation: yup.string().required(),
        //
        entitySelector: workplaceSelectors.selectAll,
        entityToString: (workplace) => workplace.name,
    } as FieldData<Inputs, Workplace>,
    {
        type: "choose_object",
        name: "schedule",
        label: "Schedule",
        validation: yup.string().required(),
        //
        entitySelector: scheduleSelectors.selectAll,
        entityToString: (schedule: Schedule) => schedule.month_year,
    } as FieldData<Inputs, Schedule>,
];

const ShiftForm = (props: Props) => {
    return <></>;
};

export default ShiftForm;
*/
