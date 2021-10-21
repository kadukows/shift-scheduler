import * as React from "react";
import axios from "axios";
import {
    Grid,
    Typography,
    Paper,
    Button,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useSelector, useDispatch } from "react-redux";

import EmployeeAgGrid from "./EmployeeAgGrid";
import EmployeeForm from "./EmployeeForm";

import {
    Employee,
    addEmployee,
    updateEmployee,
    employeeSelectors,
    removeEmployee,
} from "./employeeSlice";
import { addAlert } from "../alerts/alertsSlice";
import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";

const useStyles = makeStyles((theme) => ({
    dialog: {
        width: 450,
    },
}));

const formIds = {
    newEmployee: "new-employee-form-id",
    updateEmployee: "update-employee-form-id",
};

const employeeToString = (employee: Employee) =>
    employee ? `${employee.first_name} ${employee.last_name}` : "";

const EmployeePage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const employeesById = useSelector(employeeSelectors.selectEntities);
    const auth = useSelector((state: RootState) => state.authReducer);
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    const [updateModalOpen, setUpdateModelOpen] = React.useState(false);
    const [updateModalId, setUpdateModalId] = React.useState<number>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedEmployeeId, setDeletedEmployeeId] =
        React.useState<number>(null);

    const newEmployeeOnSubmitted = (employee: Employee) => {
        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully created a employee: "${employeeToString(
                    employee
                )}"`,
            })
        );
        dispatch(addEmployee(employee));
        setNewModalOpen(false);
    };

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

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a employee</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <EmployeeForm
                        formId={formIds.newEmployee}
                        onSubmitted={newEmployeeOnSubmitted}
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
                        form={formIds.newEmployee}
                        variant="contained"
                    >
                        Add employee
                    </Button>
                </DialogActions>
            </Dialog>

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

            <Paper sx={{ p: 2 }} elevation={3}>
                <Grid container direction="column" spacing={2}>
                    <Grid item>
                        <Typography variant="h5" component="h5">
                            Your Employees{" "}
                            <i className="fas fa-people-arrows"></i>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <EmployeeAgGrid
                            onClickCellDeletion={(id) => {
                                setDeletedEmployeeId(id);
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

export default EmployeePage;
