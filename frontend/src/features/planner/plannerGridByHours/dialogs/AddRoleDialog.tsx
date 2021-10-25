import * as React from "react";

import GenericAddDialog from "./GenericAddDialog";
import { ADD_BY_EVENT_ARG, EventTypes } from "../EventTypes";
import { roleSelectors } from "../../../roles/rolesSlice";
import { Schedule } from "../../../schedules/scheduleSlice";
import { RootState } from "../../../../store";
import { employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";

interface Props {
    schedule: Schedule;
}

const AddRoleDialog = ({ schedule }: Props) => {
    return (
        <GenericAddDialog
            eventType={EventTypes.ADD_BY_ROLE}
            schedule={schedule}
            formId="PLANNER_GRID_BY_HOURS__ADD_ROLE"
            label="Employee"
            entitySelector={(schedule: Schedule) => (state: RootState) =>
                employeeSelectors
                    .selectAll(state)
                    .filter(
                        (employee) => employee.workplace === schedule.workplace
                    )}
            entityToString={employeeToString}
            genRequestData={(
                { secondIndexItemId },
                { time_to, time_from, itemId }
            ) => ({
                schedule: schedule.id,
                employee: itemId,
                role: secondIndexItemId,
                time_to,
                time_from,
            })}
        />
    );
};

export default AddRoleDialog;
