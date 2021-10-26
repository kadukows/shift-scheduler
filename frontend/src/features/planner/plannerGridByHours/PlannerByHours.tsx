import * as React from "react";

import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import EventProvider from "../../eventProvider/EventProvider";
import PlannerGridByHours, {
    Props as PlannerGridByHoursProps,
} from "./PlannerGridByHours";
import { EventTypes } from "./EventTypes";
import UpdateEmployeeDialog from "./dialogs/UpdateEmployeeDialog";
import { Schedule } from "../../schedules/scheduleSlice";
import UpdateRoleDialog from "./dialogs/UpdateRoleDialog";
import AddEmployeeDialog from "./dialogs/AddEmployeeDialog";
import AddRoleDialog from "./dialogs/AddRoleDialog";

interface Props<Item> extends PlannerGridByHoursProps<Item> {
    schedule: Schedule;
}

const PlannerByHours = <Item extends Role | Employee>({
    schedule,
    children,
    ...rest
}: React.PropsWithChildren<Props<Item>>) => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <PlannerGridByHours {...rest} />
            {children}
        </EventProvider>
    );
};

export default PlannerByHours;
