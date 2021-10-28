import * as React from "react";

import GenericAddDialog from "./GenericAddDialog";
import { ADD_BY_EVENT_ARG, EventTypes } from "../plannerGridByHours/EventTypes";
import { roleSelectors } from "../../roles/rolesSlice";
import { Schedule } from "../../schedules/scheduleSlice";
import { RootState } from "../../../store";
import { employeeSelectors } from "../../employees/employeeSlice";
import { employeeToString } from "../../employees/helpers";

interface Props {
    scheduleId: number;
    workplaceId: number;
}

const AddRoleDialog = ({ scheduleId, workplaceId }: Props) => {
    return (
        <GenericAddDialog
            formId="PLANNER_GRID_BY_HOURS__ADD_ROLE"
            label="Employee"
            entitySelector={(state: RootState) =>
                employeeSelectors
                    .selectAll(state)
                    .filter((employee) => employee.workplace === workplaceId)
            }
            entityToString={employeeToString}
            genRequestData={(
                { secondIndexItemId },
                { time_to, time_from, itemId }
            ) => ({
                schedule: scheduleId,
                employee: itemId,
                role: secondIndexItemId,
                time_to,
                time_from,
            })}
        />
    );
};

export default AddRoleDialog;
