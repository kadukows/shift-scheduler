import * as yup from "yup";
import { RootState } from "../../../store";

import { Employee, employeeSelectors } from "../../employees/employeeSlice";
import { employeeToString } from "../../employees/helpers";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { ChooseObjectIdFieldData } from "../../genericForm/fieldInstance/ChooseObjectIdField";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { Schedule } from "../../schedules/scheduleSlice";

interface BaseInputs {
    time_from: string;
    time_to: string;
    employee: number;
    role: number;
}

/*
interface EmployeeInputs extends BaseInputs {

}

interface RoleInputs extends BaseInputs {
    role: number;
}
*/

export const getFieldDataArray = <Inputs extends Partial<BaseInputs>>(
    schedule: Schedule,
    secondIdx: "Employee" | "Role",
    timeFormat: string
): FieldData<Inputs, Role | Employee>[] => {
    const employeeSelector = (state: RootState) =>
        employeeSelectors
            .selectAll(state)
            .filter((employee) => employee.workplace === schedule.workplace);

    const roleSelector = (state: RootState) =>
        roleSelectors
            .selectAll(state)
            .filter((role) => role.workplace === schedule.workplace);

    const selector = secondIdx === "Employee" ? employeeSelector : roleSelector;
    const toString =
        secondIdx === "Employee" ? employeeToString : (role: Role) => role.name;

    return [
        {
            type: "datetime",
            name: "time_from",
            label: "Time from",
            validation: yup.string().required(),
            //
            views: ["date", "hours", "minutes"],
            format: timeFormat,
        },
        {
            type: "datetime",
            name: "time_to",
            label: "Time to",
            validation: yup.string().required(),
            //
            views: ["date", "hours", "minutes"],
            format: timeFormat,
        },
        {
            type: "choose_object",
            name: secondIdx === "Employee" ? "employee" : "role",
            label: secondIdx,
            validation: yup.string().required(),
            //
            entitySelector: selector,
            entityToString: toString,
        } as ChooseObjectIdFieldData<Inputs, Role | Employee>,
    ];
};
