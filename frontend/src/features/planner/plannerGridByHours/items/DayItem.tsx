import * as React from "react";
import { Typography } from "@mui/material";
import { format, addDays } from "date-fns";
import { useGridColumn } from "../../../genericCssGrid/GenericCssGrid";
import { BorderTypography } from "./StyledDiv";

interface Props extends React.ComponentProps<typeof Typography> {
    day: Date;
    row: string;
}

const DayItem = ({ day, row, style, ...rest }: Props) => {
    const gridArea = useGridColumn<Date>({
        xStart: day,
        yStart: row,
        xEnd: addDays(day, 1),
    });

    return (
        <BorderTypography
            style={{ ...style, gridArea }}
            sx={{ p: 0.7 }}
            align="center"
            {...rest}
        >
            {format(day, "yyyy-MM-dd, EEEE")}
        </BorderTypography>
    );
};

export default DayItem;
