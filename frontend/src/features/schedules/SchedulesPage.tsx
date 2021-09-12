import * as React from "react";
import axios from "axios";
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
import { useSelector, useDispatch } from "react-redux";

//import EmployeeAgGrid from "./EmployeeAgGrid";
//import EmployeeForm from "./EmployeeForm";
import ScheduleAgGrid from "./ScheduleAgGrid";

import {
    addSchedule,
    removeSchedule,
    Schedule,
    scheduleSelectors,
    updateSchedule,
} from "./scheduleSlice";
import { addAlert } from "../alerts/alertsSlice";
import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";
import ScheduleForm from "./ScheduleForm";

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(2),
    },
    paperSmall: {
        padding: theme.spacing(1),
    },
    dialog: {
        width: 450,
    },
}));

const formIds = {
    newSchedule: "new-schedule-form-id",
    updateSchedule: "update-schedule-form-id",
};

const SchedulePage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    //const employeesById = useSelector(employeeSelectors.selectEntities);
    const schedulesById = useSelector(scheduleSelectors.selectEntities);
    const auth = useSelector((state: RootState) => state.authReducer);

    const [newModalOpen, setNewModalOpen] = React.useState(false);

    const [updateModalOpen, setUpdateModelOpen] = React.useState(false);
    const [updateModalId, setUpdateModalId] = React.useState<number>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedModalId, setDeletedModalId] = React.useState<number>(null);

    const newScheduleSubmitted = (schedule: Schedule) => {
        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully created a new schedule.`,
            })
        );
        dispatch(addSchedule(schedule));
        setNewModalOpen(false);
    };

    const updateScheduleOnSubmitted = (schedule: Schedule) => {
        dispatch(
            addAlert({
                type: "info",
                message: `Successfully updated a schedule`,
            })
        );
        dispatch(
            updateSchedule({
                id: schedule.id,
                changes: schedule,
            })
        );

        setUpdateModelOpen(false);
    };

    const deleteScheduleById = async () => {
        try {
            await axios.delete(
                `/api/schedule/${deletedModalId}/`,
                getTokenRequestConfig(auth.token)
            );
        } catch (err) {
            // pass
        }

        dispatch(
            addAlert({
                type: "info",
                message: `Sucessfully deleted schedule.`,
            })
        );

        dispatch(removeSchedule(deletedModalId));
        setDeleteModalOpen(false);
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a schedule</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <ScheduleForm
                        formId={formIds.newSchedule}
                        onSubmitted={newScheduleSubmitted}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setNewModalOpen(false)}
                        variant="contained"
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        form={formIds.newSchedule}
                        variant="contained"
                    >
                        Add schedule
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={updateModalOpen}
                onClose={() => setUpdateModelOpen(false)}
            >
                <DialogTitle>Update schedule</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <ScheduleForm
                        formId={formIds.updateSchedule}
                        onSubmitted={updateScheduleOnSubmitted}
                        objectToModify={schedulesById[updateModalId]}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setUpdateModelOpen(false)}
                        variant="contained"
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        form={formIds.updateSchedule}
                        variant="contained"
                    >
                        Update schedule
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
            >
                <DialogTitle>Remove schedule</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete this schedule?
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() => setDeleteModalOpen(false)}
                        variant="contained"
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        onClick={deleteScheduleById}
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            <Paper className={classes.paper} elevation={3}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h5" component="h5">
                            Your Schedules{" "}
                            <i className="far fa-calendar-check" />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ScheduleAgGrid
                            onClickCellDeletion={(id) => {
                                setDeletedModalId(id);
                                setDeleteModalOpen(true);
                            }}
                            onClickCellUpdate={(id) => {
                                setUpdateModalId(id);
                                setUpdateModelOpen(true);
                            }}
                        />
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

export default SchedulePage;
