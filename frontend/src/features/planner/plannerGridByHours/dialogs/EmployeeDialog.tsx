import * as React from "react";

import GenericUpdateDialog from "./GenericUpdateDialog";
import { EventTypes } from "../EventTypes";
import { Schedule } from "../../../schedules/scheduleSlice";
import { RootState } from "../../../../store";
import { Employee, employeeSelectors } from "../../../employees/employeeSlice";
import { roleSelectors } from "../../../roles/rolesSlice";

interface Props {}

const EmployeeDialog = (props: Props) => {
    return (
        <GenericUpdateDialog
            eventType={EventTypes.EMPLOYEE_ITEM_CLICK}
            formId="PLANNER_GRID_BY_HOURS__UPDATE_EMPLOYEE"
            label="Role"
            entitySelector={(schedule: Schedule) => (state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((role) => role.workplace === schedule.workplace)}
            entityToString={(role) => role.name}
            genRequestData={(shift, { time_to, time_from, itemId }) => ({
                id: shift.id,
                schedule: shift.schedule,
                employee: shift.employee,
                role: itemId,
                time_from,
                time_to,
            })}
            getDefaultValue={(shift) => ({
                itemId: shift.role,
            })}
        />
    );
};

export default EmployeeDialog;
