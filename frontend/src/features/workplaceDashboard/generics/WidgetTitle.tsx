import * as React from "react";
import { Typography } from "@mui/material";

const WidgetTitle = (
    props: React.ComponentPropsWithoutRef<typeof Typography>
) => {
    return <Typography variant="h5" component="h5" {...props} />;
};

export default WidgetTitle;
