import * as React from "react";
import { Typography } from "@material-ui/core";
import { format } from "date-fns";

interface Props extends React.ComponentProps<typeof Typography> {
    date: Date;
}

const HeaderDay = ({ date, ...rest }: Props) => {
    return <Typography {...rest}>{format(date, "dd.MM")}</Typography>;
};

export default HeaderDay;
