import * as React from "react";

import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import EventProvider from "../../eventProvider/EventProvider";
import PlannerGridByHours, {
    Props as PlannerGridByHoursProps,
} from "./PlannerGridByHours";
import { EventTypes } from "./EventTypes";
import { Schedule } from "../../schedules/scheduleSlice";

interface Props<Item> extends PlannerGridByHoursProps<Item> {}

const PlannerByHours = <Item extends Role | Employee>({
    children,
    ...rest
}: React.PropsWithChildren<Props<Item>>) => {
    return <PlannerGridByHours {...rest} />;
};

export default PlannerByHours;
