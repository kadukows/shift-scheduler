import * as React from "react";
import { Typography } from "@material-ui/core";
import { format } from "date-fns";
import { useSelector } from "react-redux";

import { roleSelectors } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";
import { Indices } from "./ItemFactory";
import { employeeSelectors } from "../../employees/employeeSlice";
import ItemBase from "./ItemBase";

interface Props {
    indices: Indices;
    shift: Shift;
}

const PlannerItem = ({ shift, indices }: Props) => {
    const rolesById = useSelector(roleSelectors.selectEntities);
    const employeesById = useSelector(employeeSelectors.selectEntities);

    const getEmployeeString = (employee_id: number) => {
        const employee = employeesById[employee_id];

        return `${employee.first_name} ${employee.last_name}`;
    };

    return (
        <ItemBase className="planner-items-planner planner-items-hoverable">
            <Typography noWrap align="center">
                {format(new Date(shift.time_from), "H:mm")} --{" "}
                {format(new Date(shift.time_to), "H:mm")}
                <br />
                {indices.secondIdx === "Employee"
                    ? rolesById[shift.role].name
                    : getEmployeeString(shift.employee)}
            </Typography>
        </ItemBase>
    );
};

export default PlannerItem;
