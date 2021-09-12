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

import { addSchedule, Schedule } from "./scheduleSlice";
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
    const auth = useSelector((state: RootState) => state.authReducer);

    const [newModalOpen, setNewModalOpen] = React.useState(false);
    /*
    const [updateModalOpen, setUpdateModelOpen] = React.useState(false);
    const [updateModalId, setUpdateModalId] = React.useState<number>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedEmployeeId, setDeletedEmployeeId] =
        React.useState<number>(null);
    */

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

    /*
    const updateEmployeeOnSubmitted = (employee: Employee) => {
        dispatch(
            addAlert({
                type: "info",
                message: `Successfully updated an employee: "${employee.first_name} ${employee.last_name}"`,
            })
        );
        dispatch(
            updateEmployee({
                id: employee.id,
                changes: employee,
            })
        );

        setUpdateModelOpen(false);
    };

    const deleteEmployeeById = async () => {
        try {
            await axios.delete(
                `/api/employee/${deletedEmployeeId}/`,
                getTokenRequestConfig(auth.token)
            );
        } catch (err) {
            // pass
        }

        dispatch(
            addAlert({
                type: "info",
                message: `Sucessfully deleted "${employeeToString(
                    employeesById[deletedEmployeeId]
                )}".`,
            })
        );

        dispatch(removeEmployee(deletedEmployeeId));
        setDeleteModalOpen(false);
    };
    */

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
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
                        Add workplace
                    </Button>
                </DialogActions>
            </Dialog>
            {/*
            <Dialog
                open={updateModalOpen}
                onClose={() => setUpdateModelOpen(false)}
            >
                <DialogTitle>Update employee</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <EmployeeForm
                        formId={formIds.updateEmployee}
                        onSubmitted={updateEmployeeOnSubmitted}
                        objectToModify={employeesById[updateModalId]}
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
                        form={formIds.updateEmployee}
                        variant="contained"
                    >
                        Add Employee
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
            >
                <DialogTitle>Remove workplaces</DialogTitle>
                <DialogContent>
                    Are you sure you want to delete "
                    {employeeToString(employeesById[deletedEmployeeId])}"?
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
                        onClick={deleteEmployeeById}
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            */}

            <Paper className={classes.paper} elevation={3}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h5" component="h5">
                            Your Schedules{" "}
                            <i className="fas fa-people-arrows"></i>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <ScheduleAgGrid
                            onClickCellDeletion={(id) => {
                                alert("Delete");
                            }}
                            onClickCellUpdate={(id) => {
                                alert("Update");
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
