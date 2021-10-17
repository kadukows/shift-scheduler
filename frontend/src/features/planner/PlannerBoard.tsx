import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Paper } from "@material-ui/core";
import { parse, format, compareAsc, add, Duration } from "date-fns";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import HeaderDay from "./HeaderDay";
import { shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";
import AnnotatedGenericCssGrid from "../genericCssGrid/AnnotatedGenericCssGrid";
import { Props as GenericCssGridProps } from "../genericCssGrid/GenericCssGrid";
import { Employee } from "../employees/employeeSlice";
import { Role, roleSelectors } from "../roles/rolesSlice";
import ItemFactory, { Indices } from "./items/ItemFactory";
import ClickedEmptyFieldWithEmployeeWidget from "./items/ClickedEmptyFieldWithEmployeeWidget";
import EventProvider from "../eventProvider/EventProvider";
import EventTypes from "./EventTypes";
import EmptyItemDialog from "./dialogs/EmptyItemDialog";

export interface YIndexProvider<Item> {
    selector: (state: RootState) => Item[];
    annotate: (item: Item) => React.ReactNode;
}

interface Props {
    schedule: Schedule;
    yIndexProvider: YIndexProvider<Role> | YIndexProvider<Employee>;
    itemsGenerator: (
        xIndices: Date[],
        yIndices: (Role | Employee)[]
    ) => GenericCssGridProps<Date, Role | Employee>["items"];
}

function getWeek(schedule: Schedule, idx: number): Date[] {
    let date = parse(schedule.month_year, "MM.yyyy", new Date());

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

const PlannerBoard = ({ schedule, yIndexProvider, itemsGenerator }: Props) => {
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, schedule.workplace)
    );

    const week = getWeek(schedule, 1);

    const { selector, annotate } = yIndexProvider;

    // @ts-expect-error
    const employeesOrRoles: (Role | Employee)[] = useSelector(selector);
    const items = itemsGenerator(week, employeesOrRoles);

    /*
    const dayToEmployeeToShift: any = {};
    for (const day of week) {
        const employeeToShift: any = {};
        for (const employee of employees) {
            employeeToShift[employee.id] = null;
        }
        dayToEmployeeToShift[day.getDate()] = employeeToShift;
    }

    for (const shift of shifts) {
        dayToEmployeeToShift[new Date(shift.time_from).getDate()][
            shift.employee
        ] = shift;
    }

    const items: GenericCssGridProps<Date, Employee>["items"] = [];

    for (const day of week) {
        for (const employee of employees) {
            const indices = {
                date: day,
                secondIdx: "Employee",
                payload: employee,
            } as Indices;

            const shift = dayToEmployeeToShift[day.getDate()][employee.id];

            items.push({
                children: <ItemFactory indices={indices} shift={shift} />,

                xStart: day,
                xEnd: shift
                    ? add(new Date(shift.time_to), { days: 1 })
                    : undefined,

                yStart: employee,
            });
        }
    }
    */

    const annotateX = (date: Date) => (
        <Paper
            style={{
                padding: "8px",
                textAlign: "center",
            }}
        >
            <Typography noWrap>{format(date, "dd.MM, EEEE")}</Typography>
        </Paper>
    );

    return (
        <EventProvider
            events={[
                EventTypes.EMPTY_FIELD_CLICKED,
                EventTypes.NON_EMPTY_FIELD_CLICKED,
            ]}
        >
            <EmptyItemDialog schedule={schedule} />
            <Paper className="planner-board-paper" elevation={3}>
                <Typography
                    variant="h5"
                    component="h5"
                    style={{ marginBottom: 16 }}
                >
                    Planner for schedule: {workplace.name} --{" "}
                    {schedule.month_year}
                </Typography>
                <ClickedEmptyFieldWithEmployeeWidget />

                <div
                    style={{
                        display: "flex",
                    }}
                >
                    <div
                        style={{
                            width: 0,
                            flex: "1 1 100%",
                        }}
                    >
                        <AnnotatedGenericCssGrid<Date, Employee | Role>
                            x={{
                                cells: week,
                                getId: (date) => date.getDate(),
                            }}
                            y={{
                                cells: employeesOrRoles,
                                getId: (employeeOrRole) => employeeOrRole.id,
                            }}
                            annotateX={annotateX}
                            annotateY={annotate}
                            items={items}
                            style={{
                                overflowX: "auto",
                                width: "100%",
                                height: "100%",
                                gap: "8px",
                                marginBottom: "24px",
                                paddingBottom: "24px",
                            }}
                        />
                    </div>
                </div>
            </Paper>
        </EventProvider>
    );
};

export default PlannerBoard;
