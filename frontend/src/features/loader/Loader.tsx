import * as React from "react";
import { CircularProgress, Typography, Grid } from "@material-ui/core";

interface Props<SliceStateType> {
    useSlice: () => SliceStateType;
    precondition: (a: SliceStateType) => boolean;
}

function Loader<SliceStateType>({
    useSlice,
    precondition,
    children,
}: React.PropsWithChildren<Props<SliceStateType>>) {
    const slice = useSlice();

    if (!precondition(slice)) {
        return (
            <Grid
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
            >
                <CircularProgress
                    size="8rem"
                    style={{ marginBottom: "3rem" }}
                />
                <Typography component="h4" variant="h4">
                    Loading...
                </Typography>
            </Grid>
        );
    }

    return <div>{children}</div>;
}

export default Loader;
