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
//import * as Icons from "@material-ui/icons";
import Icon from "@material-ui/core/Icon";
import { Link as RouterLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import WorkplacesGrid from "./WorkplacesGrid";
import WorkplacesAgGrid from "./WorkplacesAgGrid";
import WorkplaceForm from "./workplaceForm/WorkplaceForm";
import WorkplaceFormAsGenericForm, {
    Inputs as WorkplaceFormInputs,
} from "./workplaceForm/WorkplaceFormAsGenericForm";
import WorkplaceDeleteForm, {
    Inputs as WorkplaceDeleteFormInputs,
} from "./workplaceForm/WorkplaceDeleteForm";
import {
    Workplace,
    addWorkplace,
    removeWorkplaces,
    workplaceSelectors,
    removeWorkplace,
} from "../workplaces/workplaceSlice";
import { addAlert } from "../alerts/alertsSlice";
import { getTokenRequestConfig } from "../helpers";
import { RootState } from "../../store";
import { AgGridReact } from "ag-grid-react";

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
    const auth = useSelector((state: RootState) => state.authReducer);
    const workplacesById = useSelector(workplaceSelectors.selectEntities);
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedWorkplaceId, setDeletedWorkplaceId] =
        React.useState<number>(null);

    const newWorkplaceSubmitted = async (inputs: WorkplaceFormInputs) => {
        const res = await axios.post<Workplace>(
            "/api/workplace/",
            inputs,
            getTokenRequestConfig(auth.token)
        );

        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully added a workplace: "${res.data.name}"`,
            })
        );
        dispatch(addWorkplace(res.data));
        setNewModalOpen(false);
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
                <DialogContent>
                    <WorkplaceFormAsGenericForm
                        formId={newWorkplaceFormId}
                        submit={newWorkplaceSubmitted}
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
                        form={newWorkplaceFormId}
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
                        onClick={async () => {
                            try {
                                await axios.delete(
                                    `/api/workplace/${deletedWorkplaceId}/`,
                                    getTokenRequestConfig(auth.token)
                                );
                            } catch (err) {
                                // pass
                            }

                            dispatch(
                                addAlert({
                                    type: "info",
                                    message: `Sucessfully deleted "${workplacesById[deletedWorkplaceId]?.name}".`,
                                })
                            );

                            dispatch(removeWorkplace(deletedWorkplaceId));

                            setDeleteModalOpen(false);
                        }}
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
                            Your Workplaces{" "}
                            <Icon className="fas fa-briefcase" />
                        </Typography>
                    </Grid>
                    <Grid item>
                        <WorkplacesAgGrid
                            onClickCellDeletion={(id) => {
                                setDeletedWorkplaceId(id);
                                setDeleteModalOpen(true);
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
