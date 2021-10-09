import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Paper } from "@material-ui/core";
import { parse, format, compareAsc } from "date-fns";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import HeaderDay from "./HeaderDay";
import { shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";
import AnnotatedGenericCssGrid from "../genericCssGrid/AnnotatedGenericCssGrid";
import { Employee } from "../employees/employeeSlice";
import { roleSelectors } from "../roles/rolesSlice";

interface Props {
    schedule: Schedule;
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

const PlannerBoard = ({ schedule }: Props) => {
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, schedule.workplace)
    );

    const employeeById = useSelector(employeeSelectors.selectEntities);
    const rolesById = useSelector(roleSelectors.selectEntities);

    const week = getWeek(schedule, 1);

    const shifts = useSelector(shiftSelectors.selectAll)
        .filter((shift) => shift.schedule === schedule.id)
        .filter((shift) => {
            const parsed = new Date(shift.time_from);

            return (
                compareAsc(week[0], parsed) === -1 &&
                compareAsc(parsed, week[week.length - 1]) === -1
            );
        });

    console.log(shifts);

    const employeesId = new Set<number>(shifts.map((shift) => shift.employee));

    const employees = useSelector(employeeSelectors.selectAll).filter(
        (employee) => employee.workplace === workplace.id
    );

    return (
        <Paper className="planner-board-paper" elevation={3}>
            <Typography
                variant="h5"
                component="h5"
                style={{ marginBottom: 16 }}
            >
                Planner for schedule: {workplace.name} -- {schedule.month_year}
            </Typography>

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
                    <AnnotatedGenericCssGrid<Date, Employee>
                        x={{
                            cells: week,
                            getId: (date: Date) => date.getDate(),
                        }}
                        y={{
                            cells: employees,
                            getId: (employee) => employee.id,
                        }}
                        annotateX={(date) => (
                            <Paper
                                style={{
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                <Typography noWrap>
                                    {format(date, "dd.MM, EEEE")}
                                </Typography>
                            </Paper>
                        )}
                        annotateY={(employee) => (
                            <div
                                style={{
                                    verticalAlign: "center",
                                    textAlign: "center",
                                }}
                            >{`${employee.first_name} ${employee.last_name}`}</div>
                        )}
                        items={shifts.map((shift) => ({
                            children: (
                                <div style={{ textAlign: "center" }}>
                                    {format(new Date(shift.time_from), "H:mm")}{" "}
                                    -- {format(new Date(shift.time_to), "H:mm")}
                                    <br />
                                    {rolesById[shift.role].name}
                                </div>
                            ),
                            xStart: new Date(shift.time_from),
                            yStart: employeeById[shift.employee],
                        }))}
                        style={{
                            overflowX: "auto",
                            width: "100%",
                            height: "100%",
                            gap: "1em",
                        }}
                    />
                </div>
            </div>
        </Paper>
    );
};

export default PlannerBoard;
