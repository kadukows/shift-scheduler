import * as React from "react";

import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import EventProvider from "../../eventProvider/EventProvider";
import PlannerGridByHours, {
    Props as PlannerGridByHoursProps,
} from "./PlannerGridByHours";
import { EventTypes } from "./EventTypes";
import EmployeeDialog from "./dialogs/EmployeeDialog";
import { Schedule } from "../../schedules/scheduleSlice";

interface Props<Item> extends PlannerGridByHoursProps<Item> {
    schedule: Schedule;
}

const PlannerByHours = <Item extends Role | Employee>({
    schedule,
    ...rest
}: Props<Item>) => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <EmployeeDialog />
            <PlannerGridByHours {...rest} />
        </EventProvider>
    );
};

export default PlannerByHours;
