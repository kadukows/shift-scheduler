import * as React from "react";
import { CircularProgress, Typography, Grid, Skeleton } from "@mui/material";

interface Props<SliceStateType> {
    useSlice: () => SliceStateType;
    precondition: (a: SliceStateType) => boolean;

    SkeletonProps?: React.ComponentProps<typeof Skeleton>;
}

function Loader<SliceStateType>({
    useSlice,
    precondition,
    children,
    SkeletonProps,
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
                {SkeletonProps ? (
                    <Skeleton {...SkeletonProps} />
                ) : (
                    <>
                        <CircularProgress
                            size="8rem"
                            style={{ marginBottom: "3rem" }}
                        />
                        <Typography component="h4" variant="h4">
                            Loading...
                        </Typography>
                    </>
                )}
            </Grid>
        );
    }

    return <div>{children}</div>;
}

export default Loader;

/**
 *
 */

export const connectWithLoader =
    <Props extends unknown>(useSlice: () => boolean) =>
    (Comp: React.ComponentType<Props>) =>
    (props: Props) =>
        (
            <Loader useSlice={useSlice} precondition={(a) => a}>
                <Comp {...props} />
            </Loader>
        );
