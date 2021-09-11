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

import Icon from "@material-ui/core/Icon";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import EmployeeAgGrid from "./EmployeeAgGrid";
import EmployeeForm from "./EmployeeForm";

import { Employee, addEmployee } from "./employeeSlice";
import { addAlert } from "../alerts/alertsSlice";
import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";

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
    newEmployee: "new-employee-form-id",
};

const WorkplacesPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.authReducer);
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    //const workplacesById = useSelector(workplaceSelectors.selectEntities);
    /*
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    const [updateModalOpen, setUpdateModelOpen] = React.useState(false);
    const [updateModalId, setUpdateModalId] = React.useState<number>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedWorkplaceId, setDeletedWorkplaceId] =
        React.useState<number>(null);
    */
    const newEmployeeOnSubmitted = (employee: Employee) => {
        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully created a employee: "${employee.first_name} ${employee.last_name}"`,
            })
        );
        dispatch(addEmployee(employee));
        setNewModalOpen(false);
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
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
                        Add workplace
                    </Button>
                </DialogActions>
            </Dialog>
            {/*
            <Dialog
                open={updateModalOpen}
                onClose={() => setUpdateModelOpen(false)}
            >
                <DialogTitle>Update workplace</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <WorkplaceForm
                        formId={updateWorkplaceFormId}
                        onSubmitted={updateWorkplaceSubmitted}
                        objectToModify={workplacesById[updateModalId]}
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
                        form={updateWorkplaceFormId}
                        variant="contained"
                    >
                        Add workplace
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
                    {workplacesById[deletedWorkplaceId]?.name}"?
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
                        onClick={deleteWorkplaceById}
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
                            Your Employees{" "}
                            <i className="fas fa-people-arrows"></i>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <EmployeeAgGrid
                            onClickCellDeletion={(id) => {
                                alert(`Cell deletion ${id}`);
                            }}
                            onClickCellUpdate={(id) => {
                                alert(`Update cell ${id}`);
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

export default WorkplacesPage;
