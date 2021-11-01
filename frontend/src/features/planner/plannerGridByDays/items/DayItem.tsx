import * as React from "react";
import { Paper, Typography } from "@mui/material";
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
        <Paper style={{ gridArea }} elevation={4}>
            <Typography sx={{ p: 2 }} align="center">
                {format(day, "yyyy-MM-dd")}
                <br />
                {format(day, "EEEE")}
            </Typography>
        </Paper>
    );
};

export default DayItem;
