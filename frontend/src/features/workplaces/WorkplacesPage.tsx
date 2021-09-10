import * as React from "react";
import {
    Grid,
    Typography,
    Paper,
    makeStyles,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@material-ui/core";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import WorkplacesGrid from "./WorkplacesGrid";
import WorkplacesAgGrid from "./WorkplacesAgGrid";
import WorkplaceForm from "./workplaceForm/WorkplaceForm";
import WorkplaceFormAsGenericForm from "./workplaceForm/WorkplaceFormAsGenericForm";
import { Workplace, addWorkplace } from "../workplaces/workplaceSlice";
import { addAlert } from "../alerts/alertsSlice";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
    },
    paperSmall: {
        padding: theme.spacing(1),
    },
}));

const newWorkplaceFormId = "new-workplace-form";

const WorkplacesPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const [newModalOpen, setNewModalOpen] = React.useState(false);

    const newWorkplaceSubmitted = (workplace: Workplace) => {
        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully added a workplace: "${workplace.name}"`,
            })
        );
        dispatch(addWorkplace(workplace));
        setNewModalOpen(false);
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
                <DialogContent>
                    <WorkplaceFormAsGenericForm
                        formId={newWorkplaceFormId}
                        sucessfullySubmitted={newWorkplaceSubmitted}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setNewModalOpen(false)}
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        form={newWorkplaceFormId}
                    >
                        Add workplace
                    </Button>
                </DialogActions>
            </Dialog>
            <Paper className={classes.paper} elevation={3}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h5" component="h5">
                            Your Workplaces ,0
                        </Typography>
                    </Grid>
                    {/*
                <Grid item>
                    <WorkplacesGrid />
                </Grid>
                */}
                    <Grid item>
                        <WorkplacesAgGrid />
                    </Grid>
                    <Grid item>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setNewModalOpen(true)}
                                >
                                    Add new
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </>
    );
};

export default WorkplacesPage;
