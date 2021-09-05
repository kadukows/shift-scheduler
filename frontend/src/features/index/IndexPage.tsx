import * as React from "react";
import { useDispatch } from "react-redux";
import { Paper, Typography, Button, Grid, makeStyles } from "@material-ui/core";

import { addAlert } from "../alerts/alertsSlice";

interface Props {}

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
    },
}));

const MyButton = (props: React.ComponentProps<typeof Button>) => (
    <Button color="primary" variant="contained" {...props} />
);

const IndexPage = (props: Props) => {
    const dispatch = useDispatch();
    const classes = useStyles();

    return (
        <Paper className={classes.paper}>
            <Grid container spacing={2} direction="column" alignItems="center">
                <Grid item>
                    <Typography variant="h5" component="h5">
                        This is as Index Page!
                    </Typography>
                </Grid>
                <Grid item>
                    <Grid item container direction="row" spacing={2}>
                        <Grid item>
                            <MyButton
                                onClick={() =>
                                    dispatch(
                                        addAlert({
                                            type: "info",
                                            message:
                                                "This is simple info alert",
                                        })
                                    )
                                }
                            >
                                info alert
                            </MyButton>
                        </Grid>
                        <Grid item>
                            <MyButton
                                color="secondary"
                                onClick={() =>
                                    dispatch(
                                        addAlert({
                                            type: "warning",
                                            message:
                                                "This is simple warning alert",
                                        })
                                    )
                                }
                            >
                                warnign alert
                            </MyButton>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default IndexPage;
