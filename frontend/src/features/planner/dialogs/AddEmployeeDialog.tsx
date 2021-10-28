import * as React from "react";

import GenericAddDialog from "./GenericAddDialog";
import { roleSelectors } from "../../roles/rolesSlice";
import { RootState } from "../../../store";

interface Props {
    scheduleId: number;
    workplaceId: number;
}

const AddEmployeeDialog = ({ scheduleId, workplaceId }: Props) => {
    return (
        <GenericAddDialog
            formId="PLANNER_GRID_BY_HOURS__ADD_EMPLOYEE"
            label="Role"
            entitySelector={(state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((role) => role.workplace === workplaceId)
            }
            entityToString={(role) => role.name}
            genRequestData={(
                { secondIndexItemId },
                { time_to, time_from, itemId }
            ) => ({
                schedule: scheduleId,
                employee: secondIndexItemId,
                role: itemId,
                time_to,
                time_from,
            })}
        />
    );
};

export default AddEmployeeDialog;
