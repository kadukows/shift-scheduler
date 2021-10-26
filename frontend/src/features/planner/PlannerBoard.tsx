import * as React from "react";
import { useSelector } from "react-redux";
import { Typography, Paper, TextField, MenuItem } from "@mui/material";
import * as DateFns from "date-fns";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { Shift, shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";
import { Employee } from "../employees/employeeSlice";
import { employeeToString } from "../employees/helpers";
import { Role, roleSelectors } from "../roles/rolesSlice";

import { SecondIndexHandler } from "./plannerGridByHours/PlannerGridByHours";
import PlannerByHours from "./plannerGridByHours/PlannerByHours";
import { SECOND_INDEX } from "./plannerGridByHours/SecondIndexType";
import EmployeeItem from "./plannerGridByHours/items/EmployeeItem";
import RoleItem from "./plannerGridByHours/items/RoleItem";
import AddEmployeeDialog from "./plannerGridByHours/dialogs/AddEmployeeDialog";
import AddRoleDialog from "./plannerGridByHours/dialogs/AddRoleDialog";
import UpdateEmployeeDialog from "./plannerGridByHours/dialogs/UpdateEmployeeDialog";
import UpdateRoleDialog from "./plannerGridByHours/dialogs/UpdateRoleDialog";

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

    //
    // planner grid by hours
    //

    const monthYear = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());

    const timeRange: DateFns.Interval = {
        start: monthYear.getTime(),
        end: DateFns.addDays(DateFns.addMonths(monthYear, 1), -25).getTime(),
    };

    const secondIndexHandler:
        | SecondIndexHandler<Employee>
        | SecondIndexHandler<Role> = React.useMemo(
        () =>
            secondIdx === "Employee"
                ? ({
                      itemSelector: (state: RootState) =>
                          employeeSelectors
                              .selectAll(state)
                              .filter(
                                  (employee) =>
                                      employee.workplace === schedule.workplace
                              ),
                      getId: (a: Employee) => a.id,
                      secondIndexType: SECOND_INDEX.Employee,
                      itemToString: employeeToString,
                      ItemComponent: EmployeeItem,
                  } as SecondIndexHandler<Employee>)
                : ({
                      itemSelector: (state: RootState) =>
                          roleSelectors
                              .selectAll(state)
                              .filter(
                                  (role) =>
                                      role.workplace === schedule.workplace
                              ),
                      getId: (a: Role) => a.id,
                      secondIndexType: SECOND_INDEX.Role,
                      itemToString: (role: Role) => role.name,
                      ItemComponent: RoleItem,
                  } as SecondIndexHandler<Role>),
        [schedule.workplace, secondIdx]
    );

    const shiftSelector = React.useMemo(
        () => (state: RootState) =>
            shiftSelectors
                .selectAll(state)
                .filter((shift) => shift.schedule === schedule.id),
        [schedule.id]
    );

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
                shiftSelector={shiftSelector}
                schedule={schedule}
            >
                {secondIdx === SECOND_INDEX.Employee ? (
                    <>
                        <AddEmployeeDialog
                            scheduleId={schedule.id}
                            workplaceId={schedule.workplace}
                        />
                        <UpdateEmployeeDialog />
                    </>
                ) : (
                    <>
                        <AddRoleDialog
                            scheduleId={schedule.id}
                            workplaceId={schedule.workplace}
                        />
                        <UpdateRoleDialog />
                    </>
                )}
            </PlannerByHours>
        </Paper>
    );
};

export default PlannerBoard;

/**
 *
 */

const shiftSelector = (state: RootState) => shiftSelectors.selectAll(state);
