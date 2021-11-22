import * as React from "react";
import {
    Table,
    TableContainer,
    Paper,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    styled,
} from "@mui/material";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridValueGetterParams,
} from "@mui/x-data-grid";
import * as DateFns from "date-fns";
import { useSelector } from "react-redux";
import { Shift } from "../shift/shiftSlice";
import { Role } from "../../roles/rolesSlice";
import { roleSelectors } from "../role/roleSlice";

interface Props {
    start: number;
    end: number;
    useGetShifts: () => Shift[];
}

const ScheduleTable = ({ start, end, useGetShifts }: Props) => {
    const shifts = useGetShifts();
    const rolesById = useSelector(roleSelectors.selectEntities);
    const days = DateFns.eachDayOfInterval({ start, end });

    const shiftToStr = (shift: Shift) =>
        `${rolesById[shift.role].name} | ${DateFns.format(
            Date.parse(shift.time_from),
            "HH:mm"
        )}--${DateFns.format(Date.parse(shift.time_to), "HH:mm")}`;

    const gridColDef: GridColDef[] = [
        {
            field: "day",
            headerName: "Day",
            flex: 1,
            valueGetter: ((params: GridRowParams<Data>) =>
                DateFns.format(params.row.date, "yyyy-MM-dd, EEEE")) as any,
        },
        {
            field: "shifts",
            headerName: "Shifts",
            flex: 5,
            valueGetter: ((params: GridRowParams<Data>) =>
                params.row.shifts.map(shiftToStr).join(", ")) as any,
        },
    ];

    const dateToShifts = new Map<number, Shift[]>();
    for (const shift of shifts) {
        const shiftDate = DateFns.startOfDay(
            Date.parse(shift.time_from)
        ).getTime();

        if (!dateToShifts.has(shiftDate)) {
            dateToShifts.set(shiftDate, []);
        }

        dateToShifts.get(shiftDate).push(shift);
    }

    const rows = days.map((day) => ({
        id: day.getTime(),
        date: day,
        shifts: dateToShifts.has(day.getTime())
            ? dateToShifts.get(day.getTime())
            : [],
    }));

    return <DataGrid columns={gridColDef} rows={rows} />;
};

export default ScheduleTable;

/**
 *
 */

interface Data {
    date: Date;
    shifts: Shift[];
}
