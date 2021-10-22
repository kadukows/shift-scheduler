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

import PlannerGridByHours, {
    SecondIndexHandler,
} from "./plannerGridByHours/PlannerGridByHours";

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
    for (let i = 0; i < 30 && currentMonth === date.getMonth(); ++i) {
        result.push(new Date(date));
        date.setDate(date.getDate() + 1);
    }

    return result;
}

const PlannerBoard = ({ schedule }: Props) => {
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, schedule.workplace)
    );

    const [secondIdx, setSecondIdx] = React.useState<"Employee" | "Role">(
        "Employee"
    );

    const shifts = useSelector(shiftSelectors.selectAll).filter(
        (shift) => shift.schedule === schedule.id
    );

    const yIndexProvider = getYIdxProvider(secondIdx, schedule);
    const dates = getWeek(schedule, 1);
    const itemGenerator = getItemsGenerator(secondIdx, shifts);

    //
    // planner grid by hours
    //

    const timeRange: DateFns.Interval = {
        start: DateFns.startOfDay(
            shifts
                .map((shift) => Date.parse(shift.time_from))
                .reduce((a, b) => Math.min(a, b))
        ),
        end: DateFns.endOfDay(
            shifts
                .map((shift) => Date.parse(shift.time_to))
                .reduce((a, b) => Math.max(a, b))
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

    const secondIndexHandler:
        | SecondIndexHandler<Employee>
        | SecondIndexHandler<Role> =
        secondIdx === "Employee"
            ? ({
                  items: employees,
                  getId: (a) => a.id,
                  getItemFromShift: (shift) => employeesById[shift.employee],
              } as SecondIndexHandler<Employee>)
            : ({
                  items: roles,
                  getId: (a) => a.id,
                  getItemFromShift: (shift) => rolesById[shift.role],
              } as SecondIndexHandler<Role>);

    return (
        <EventProvider
            events={[
                EventTypes.EMPTY_FIELD_CLICKED,
                EventTypes.NON_EMPTY_FIELD_CLICKED,
            ]}
        >
            <EmptyItemDialog schedule={schedule} />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Paper className="planner-board-paper" elevation={3}>
                    <Typography
                        variant="h5"
                        component="h5"
                        style={{ marginBottom: 16 }}
                    >
                        Planner for schedule: {workplace.name} --{" "}
                        {schedule.month_year}
                    </Typography>
                    <TextField
                        select
                        variant="outlined"
                        label="By"
                        value={secondIdx}
                        onChange={(event) =>
                            setSecondIdx(
                                event.target.value as "Employee" | "Role"
                            )
                        }
                    >
                        <MenuItem value={"Employee"}>Employee</MenuItem>
                        <MenuItem value={"Role"}>Role</MenuItem>
                    </TextField>
                    <PlannerGrid
                        yIndexProvider={yIndexProvider}
                        dates={dates}
                        itemsGenerator={itemGenerator}
                    />
                </Paper>
                <Paper sx={{ mt: 2 }}>
                    <PlannerGridByHours<Role | Employee>
                        timeRange={timeRange}
                        secondIndexHandler={secondIndexHandler}
                        shifts={shifts}
                    />
                </Paper>
            </div>
        </EventProvider>
    );
};

export default PlannerBoard;

//
//
//

const getYIdxProvider = (
    secondIdx: "Employee" | "Role",
    schedule: Schedule
): YIndexProvider<Role> | YIndexProvider<Employee> => {
    if (secondIdx === "Employee") {
        return {
            selector: (state: RootState) =>
                employeeSelectors
                    .selectAll(state)
                    .filter(
                        (employee) => employee.workplace === schedule.workplace
                    ),
            annotate: (employee) => (
                <Typography align="center">
                    {employeeToString(employee)}
                </Typography>
            ),
        } as YIndexProvider<Employee>;
    } else {
        return {
            selector: (state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((role) => role.workplace === schedule.workplace),
            annotate: (role) => (
                <Typography align="center">{role.name}</Typography>
            ),
        } as YIndexProvider<Role>;
    }
};

const getItemsGenerator = (
    secondIdx: "Employee" | "Role",
    shifts: Shift[]
): ItemsGenerator => {
    interface ShiftAndInterval {
        shift: Shift;
        interval: DateFns.Interval;
    }

    const shiftAndIntervals: ShiftAndInterval[] = shifts.map((shift) => {
        const start = DateFns.set(Date.parse(shift.time_from), {
            hours: 0,
            minutes: 0,
            seconds: 0,
        });
        const end = DateFns.set(Date.parse(shift.time_to), {
            hours: 23,
            minutes: 59,
            seconds: 59,
        });

        const interval: Interval = { start, end };

        return { shift, interval };
    });

    type TemplatedGetItemsGenerator = (
        shiftPayloadEq: (shift: Shift, payload: Employee | Role) => boolean,
        secondIdx: "Employee" | "Role"
    ) => ItemsGenerator;

    const templatedGetItemsGenerator: TemplatedGetItemsGenerator =
        (shiftPayloadEq, secondIdx) => (dates, payloads) => {
            const addedShiftsId = new Set<number>();
            const result: GenericCssGridProps<Date, Employee | Role>["items"] =
                [];

            for (const date of dates) {
                for (const payload of payloads) {
                    const shiftAndInterval = shiftAndIntervals.find(
                        ({ shift, interval }) =>
                            DateFns.isWithinInterval(date, interval) &&
                            shiftPayloadEq(shift, payload)
                    );

                    if (shiftAndInterval) {
                        const { shift, interval } = shiftAndInterval;

                        if (!addedShiftsId.has(shift.id)) {
                            const children = (
                                <ItemFactory
                                    shift={shift}
                                    // @ts-expect-error
                                    indices={{
                                        secondIdx,
                                        payload,
                                        date,
                                    }}
                                />
                            );

                            result.push({
                                children,
                                xStart: interval.start as Date,
                                xEnd: DateFns.add(interval.end, { days: 1 }),
                                yStart: payload,
                            });

                            addedShiftsId.add(shift.id);
                        }
                    } else {
                        const children = (
                            <ItemFactory
                                // @ts-expect-error
                                indices={{
                                    secondIdx,
                                    payload,
                                    date,
                                }}
                            />
                        );

                        result.push({
                            children,
                            xStart: date,
                            yStart: payload,
                        });
                    }
                }
            }

            return result;
        };

    if (secondIdx === "Employee") {
        return templatedGetItemsGenerator(
            (shift, employee: Employee) => shift.employee === employee.id,
            "Employee"
        );
    } else {
        return templatedGetItemsGenerator(
            (shift, role: Role) => shift.role === role.id,
            "Role"
        );
    }
};
