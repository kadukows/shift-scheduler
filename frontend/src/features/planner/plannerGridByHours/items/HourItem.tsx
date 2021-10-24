import * as React from "react";
import { Typography } from "@mui/material";
import { format } from "date-fns";
import { useGridColumn } from "../../../genericCssGrid/GenericCssGrid";
import { BorderTypography } from "./StyledDiv";

interface Props extends React.ComponentProps<typeof Typography> {
    hour: Date;
    row: string;
}

const HourItem = ({ hour, row, style, ...rest }: Props) => {
    const gridArea = useGridColumn<Date>({ xStart: hour, yStart: row });

    return (
        <BorderTypography
            style={{ ...style, gridArea }}
            {...rest}
            sx={{ p: 0.7 }}
        >
            {format(hour, "HH")}
        </BorderTypography>
    );
};

export default HourItem;
