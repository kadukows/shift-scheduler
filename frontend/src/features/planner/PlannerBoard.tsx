import * as React from "react";
import { useSelector } from "react-redux";
import { Typography, Paper, TextField, MenuItem } from "@mui/material";
import * as DateFns from "date-fns";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import { Shift, shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";
import { Props as GenericCssGridProps } from "../genericCssGrid/GenericCssGrid";
import { Employee } from "../employees/employeeSlice";
import { employeeToString } from "../employees/helpers";
import { Role, roleSelectors } from "../roles/rolesSlice";
import ItemFactory from "./items/ItemFactory";
import ClickedEmptyFieldWithEmployeeWidget from "./items/ClickedEmptyFieldWithEmployeeWidget";
import EventProvider from "../eventProvider/EventProvider";
import EventTypes from "./EventTypes";
import EmptyItemDialog from "./dialogs/EmptyItemDialog";
import PlannerGrid, { YIndexProvider, ItemsGenerator } from "./PlannerGrid";

import { SecondIndexHandler } from "./plannerGridByHours/PlannerGridByHours";
import PlannerByHours from "./plannerGridByHours/PlannerByHours";
import { SECOND_INDEX } from "./plannerGridByHours/SecondIndexType";
import EmployeeItem from "./plannerGridByHours/items/EmployeeItem";
import RoleItem from "./plannerGridByHours/items/RoleItem";
import RedirectWithAlert from "../alerts/RedirectWithAlert";

interface Props {
    schedule: Schedule;
}

function getWeek(schedule: Schedule, idx: number): Date[] {
    let date = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());

    date.setDate(date.getDate() + idx * 7);
    while (date.getDay() != 0) {
        date.setDate(date.getDate() - 1);
    }

    let result: Date[] = [];
    const currentMonth = date.getMonth();
    for (let i = 0; i < 6 && currentMonth === date.getMonth(); ++i) {
        result.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return result;
}

const PlannerBoard = ({ schedule }: Props) => {
    const [secondIdx, setSecondIdx] = React.useState<"Employee" | "Role">(
        "Employee"
    );

    const shifts = useSelector(shiftSelectors.selectAll).filter(
        (shift) => shift.schedule === schedule.id
    );

    //
    // planner grid by hours
    //

    const monthYear = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());

    const timeRange: DateFns.Interval = {
        start: DateFns.startOfDay(
            shifts
                .map((shift) => Date.parse(shift.time_from))
                .reduce((a, b) => Math.min(a, b), monthYear.getTime())
        ),
        end: DateFns.endOfDay(
            shifts
                .map((shift) => Date.parse(shift.time_to))
                .reduce(
                    (a, b) => Math.max(a, b),
                    DateFns.addMonths(monthYear, 1).getTime()
                )
        ),
    };

    const employees = useSelector(employeeSelectors.selectAll).filter(
        (employee) => employee.workplace === schedule.workplace
    );

    const employeesById = useSelector(employeeSelectors.selectEntities);

    const roles = useSelector(roleSelectors.selectAll).filter(
        (role) => role.workplace === schedule.workplace
    );

    const rolesById = useSelector(roleSelectors.selectEntities);

    const renderShiftEmployee = (shift: Shift) => (
        <EmployeeItem shift={shift} />
    );

    const renderShiftRole = (shift: Shift) => <RoleItem shift={shift} />;

    const secondIndexHandler:
        | SecondIndexHandler<Employee>
        | SecondIndexHandler<Role> =
        secondIdx === "Employee"
            ? {
                  items: employees,
                  getId: (a: Employee) => a.id,
                  getItemFromShift: (shift) => employeesById[shift.employee],
                  renderShift: renderShiftEmployee,
                  secondIndexType: SECOND_INDEX.Employee,
                  itemToString: employeeToString,
              }
            : {
                  items: roles,
                  getId: (a: Role) => a.id,
                  getItemFromShift: (shift) => rolesById[shift.role],
                  renderShift: renderShiftRole,
                  secondIndexType: SECOND_INDEX.Role,
                  itemToString: (role: Role) => role.name,
              };

    return (
        <Paper sx={{ p: 3 }}>
            <TextField
                select
                label="Second index"
                onChange={(e) =>
                    setSecondIdx(e.target.value as "Role" | "Employee")
                }
                value={secondIdx}
                style={{ minWidth: 120 }}
            >
                <MenuItem value="Employee">Employee</MenuItem>
                <MenuItem value="Role">Role</MenuItem>
            </TextField>
            <PlannerByHours<Role | Employee>
                timeRange={timeRange}
                secondIndexHandler={secondIndexHandler}
                shifts={shifts}
                schedule={schedule}
            />
        </Paper>
    );
};

export default PlannerBoard;
