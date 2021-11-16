import * as React from "react";
import { useSelector } from "react-redux";
import * as DateFns from "date-fns";
import { Box, Paper } from "@mui/material";
import { GridColDef, GridRowParams, DataGrid } from "@mui/x-data-grid";
import { RootState } from "../../../store";
import { shiftSelectors, Shift } from "./shiftSlice";
import { scheduleSelectors } from "../schedule/scheduleSlice";

interface Props {
    scheduleId: number;
}

const ShiftWidget = ({ scheduleId }: Props) => {
    const shifts = useSelector((state: RootState) => {
        return shiftSelectors
            .selectAll(state)
            .filter((shift) => shift.schedule === scheduleId);
    });

    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, scheduleId)
    );

    const start = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());
    const days = DateFns.eachDayOfInterval({
        start,
        end: DateFns.addMonths(start, 1),
    });

    interface DayAndShifts {
        day: Date;
        shifts: Shift[];
    }

    const dayAndShifts: DayAndShifts[] = days.map((day) => ({
        id: day.getTime(),
        day,
        shifts: shifts.filter(shiftIsOnDay(day)),
    }));

    const columnDefs: GridColDef[] = React.useMemo(
        () =>
            [
                {
                    field: "day",
                    headerName: "Date",
                    valueGetter: (params: GridRowParams<DayAndShifts>) =>
                        DateFns.format(params.row.day, "dd.MM.yyyy"),
                },
                {
                    field: "shifts",
                    headerName: "shifts",
                    flex: 1,
                    valueGetter: (params: GridRowParams<DayAndShifts>) =>
                        params.row.shifts
                            .map(
                                (shift) =>
                                    `${DateFns.format(
                                        Date.parse(shift.time_from),
                                        "HH:mm"
                                    )} -- ${DateFns.format(
                                        Date.parse(shift.time_to),
                                        "HH:mm"
                                    )}`
                            )
                            .join(", "),
                },
            ] as unknown as GridColDef[],
        []
    );

    return (
        <Paper sx={{ p: 4 }}>
            <Box sx={{ width: "100%", height: 500 }}>
                <DataGrid columns={columnDefs} rows={dayAndShifts} />
            </Box>
        </Paper>
    );
};

export default ShiftWidget;

/**
 *
 */

const shiftIsOnDay = (day: Date) => (shift: Shift) =>
    DateFns.startOfDay(Date.parse(shift.time_from)).getTime() === day.getTime();
