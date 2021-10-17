import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import * as DateFns from "date-fns";
import { Typography } from "@material-ui/core";

import { RootState } from "../../store";
import PlannerBoard from "./PlannerBoard";
import Loader from "../loader/Loader";
import { Schedule, scheduleSelectors } from "../schedules/scheduleSlice";
import RedirectWithAlert from "../alerts/RedirectWithAlert";
import { YIndexProvider } from "./PlannerBoard";
import { Props as GenericCssGridProps } from "../genericCssGrid/GenericCssGrid";

import "./style.css";

import { Role, roleSelectors } from "../roles/rolesSlice";
import { Employee, employeeSelectors } from "../employees/employeeSlice";
import { employeeToString } from "../employees/helpers";
import { Shift, shiftSelectors } from "../shifts/shiftSlice";
import ItemFactory from "./items/ItemFactory";

interface Props {}

interface RouteMatch {
    schedule_id: string;
}

const PlannerPage = (props: Props) => {
    const schedule_id = parseInt(
        useRouteMatch<RouteMatch>().params.schedule_id
    );
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, schedule_id)
    );

    const [secondIdx, setSecondIdx] = React.useState<"Employee" | "Role">(
        "Employee"
    );

    let shifts: Shift[] = null;

    if (schedule)
        shifts = useSelector(shiftSelectors.selectAll).filter(
            (shift) => shift.schedule === schedule.id
        );

    return schedule ? (
        <PlannerBoard
            schedule={schedule}
            yIndexProvider={getYIdxSelector(secondIdx, schedule)}
            itemsGenerator={getItemsGenerator(secondIdx, shifts)}
        />
    ) : (
        <RedirectWithAlert
            alert={{
                type: "warning",
                message: "Schedule not found",
            }}
            to="/"
        />
    );
};

export default PlannerPage;

const getYIdxSelector = (
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
            annotate: employeeToString,
        } as YIndexProvider<Employee>;
    } else {
        return {
            selector: (state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((role) => role.workplace === schedule.workplace),
            annotate: (role) => role.name,
        } as YIndexProvider<Role>;
    }
};

type ItemGenerator = (
    xIndices: Date[],
    yIndices: (Role | Employee)[]
) => GenericCssGridProps<Date, Role | Employee>["items"];

const getItemsGenerator = (
    secondIdx: "Employee" | "Role",
    shifts: Shift[]
): ItemGenerator => {
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
    ) => ItemGenerator;

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
        return (dates, employees: Employee[]) => {
            const addedShiftsId = new Set<number>();
            const result: GenericCssGridProps<Date, Employee>["items"] = [];

            for (const date of dates) {
                for (const employee of employees) {
                    const shiftAndInterval = shiftAndIntervals.find(
                        ({ shift, interval }) =>
                            DateFns.isWithinInterval(date, interval) &&
                            shift.employee === employee.id //////////////////
                    );

                    if (shiftAndInterval) {
                        const { shift, interval } = shiftAndInterval;

                        if (!addedShiftsId.has(shift.id)) {
                            const children: React.ReactNode = (
                                <ItemFactory
                                    shift={shift}
                                    indices={{
                                        secondIdx: "Employee", ///////////////
                                        payload: employee,
                                        date: date,
                                    }}
                                />
                            );

                            result.push({
                                children,
                                xStart: interval.start as Date,
                                xEnd: DateFns.add(interval.end, { days: 1 }),
                                yStart: employee, //////////////////
                            });

                            addedShiftsId.add(shift.id);
                        }
                    } else {
                        const children = (
                            <ItemFactory
                                indices={{
                                    secondIdx: "Employee",
                                    payload: employee,
                                    date: date,
                                }}
                            />
                        );

                        result.push({
                            children,
                            xStart: date,
                            yStart: employee,
                        });
                    }
                }
            }

            return result;
        };
    } else {
        throw new Error("Sime");
    }
};
