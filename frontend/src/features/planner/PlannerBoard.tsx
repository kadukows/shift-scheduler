import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import { Typography, Paper } from "@material-ui/core";
import { parse, format } from "date-fns";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import HeaderDay from "./HeaderDay";
import { shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";

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
    for (let i = 0; i < 7; ++i) {
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

    const week = getWeek(schedule, 1);
    const from = Date.parse(format(week[0], "dd.MM.yyyy"));
    const to = Date.parse(format(week[6], "dd.MM.yyyy") + " 23:59:59");

    const shifts = useSelector(shiftSelectors.selectAll)
        .filter((shift) => shift.schedule === schedule.id)
        .filter((shift) => {
            const parsed = Date.parse(shift.time_from);
            return from <= parsed && parsed <= to;
        });

    console.log(shifts);

    //const noOfRows = [1, 2, 3];
    const gridTemplateRows = `
        [days] auto
        ${noOfRows.map((no) => `[row-${no}] 1fr`).join("\n")}
    `;

    const gridTemplateColumns = `
        [employees] 3em
        ${week.map((date) => `[day-${date.getDate()}] 1fr`).join("\n")}
    `;

    console.log(gridTemplateRows, gridTemplateColumns);

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
                className="planner-board"
                style={{
                    gridTemplateColumns,
                    gridTemplateRows,
                }}
            >
                {week.map((date) => (
                    <HeaderDay
                        key={date.getDate()}
                        date={date}
                        style={{
                            gridRow: "days",
                            gridColumn: `day-${date.getDate()}`,
                        }}
                    />
                ))}
            </div>
        </Paper>
    );
};

export default PlannerBoard;
