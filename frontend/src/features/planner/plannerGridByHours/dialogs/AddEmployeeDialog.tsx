import * as React from "react";

import GenericAddDialog from "./GenericAddDialog";
import { ADD_BY_EVENT_ARG, EventTypes } from "../EventTypes";
import { roleSelectors } from "../../../roles/rolesSlice";
import { Schedule } from "../../../schedules/scheduleSlice";
import { RootState } from "../../../../store";

interface Props {
    schedule: Schedule;
}

const AddEmployeeDialog = ({ schedule }: Props) => {
    return (
        <GenericAddDialog
            eventType={EventTypes.ADD_BY_EMPLOYEE}
            schedule={schedule}
            formId="PLANNER_GRID_BY_HOURS__ADD_EMPLOYEE"
            label="Role"
            entitySelector={(schedule: Schedule) => (state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((role) => role.workplace === schedule.workplace)}
            entityToString={(role) => role.name}
            genRequestData={(
                { secondIndexItemId },
                { time_to, time_from, itemId }
            ) => ({
                schedule: schedule.id,
                employee: secondIndexItemId,
                role: itemId,
                time_to,
                time_from,
            })}
        />
    );
};

export default AddEmployeeDialog;
