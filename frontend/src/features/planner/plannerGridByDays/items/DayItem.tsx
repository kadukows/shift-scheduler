import * as React from "react";
import { Paper } from "@mui/material";
import { format, addDays } from "date-fns";
import { useGridColumn } from "../../../genericCssGrid/GenericCssGrid";

interface Props {
    day: Date;
    row: string;
}

const DayItem = ({ day, row }: Props) => {
    const gridArea = useGridColumn<Date>({
        xStart: day,
        yStart: row,
        xEnd: addDays(day, 1),
    });

    return (
        <Paper sx={{ p: 0.7 }} style={{ gridArea }}>
            {format(day, "yyyy-MM-dd")}
            <br />
            {format(day, "EEEE")}
        </Paper>
    );
};

export default DayItem;
