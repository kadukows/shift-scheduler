import * as React from "react";

import GenericUpdateDialog from "./GenericUpdateDialog";
import { EventTypes } from "../EventTypes";
import { Schedule } from "../../../schedules/scheduleSlice";
import { RootState } from "../../../../store";
import { Employee, employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";

interface Props {}

const UpdateRoleDialog = (props: Props) => {
    return (
        <GenericUpdateDialog
            formId="PLANNER_GRID_BY_HOURS__UPDATE_ROLE"
            label="Employee"
            entitySelector={(schedule: Schedule) => (state: RootState) =>
                employeeSelectors
                    .selectAll(state)
                    .filter(
                        (employee) => employee.workplace === schedule.workplace
                    )}
            entityToString={employeeToString}
            genRequestData={(shift, { time_to, time_from, itemId }) => ({
                id: shift.id,
                schedule: shift.schedule,
                employee: itemId,
                role: shift.role,
                time_from,
                time_to,
            })}
            getDefaultValue={(shift) => ({
                itemId: shift.employee,
            })}
        />
    );
};

export default UpdateRoleDialog;
