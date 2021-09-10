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

import GenericAddOrUpdateForm from "../genericForm/GenericAddOrUpdateForm";
import WorkplacesAgGrid from "./WorkplacesAgGrid";
import WorkplaceFormAsGenericForm, {
    Inputs as WorkplaceFormInputs,
} from "./workplaceForm/WorkplaceFormAsGenericForm";
import {
    Workplace,
    addWorkplace,
    removeWorkplaces,
    workplaceSelectors,
    removeWorkplace,
    updateWorkplace,
} from "../workplaces/workplaceSlice";
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

const newWorkplaceFormId = "new-workplace-form";
const updateWorkplaceFormId = "update-workplace-form";

const WorkplacesPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.authReducer);
    const workplacesById = useSelector(workplaceSelectors.selectEntities);
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    const [updateModalOpen, setUpdateModelOpen] = React.useState(false);
    const [updateModalId, setUpdateModalId] = React.useState<number>(null);
    const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
    const [deletedWorkplaceId, setDeletedWorkplaceId] =
        React.useState<number>(null);

    const newWorkplaceOnSubmitted = (workplace: Workplace) => {
        dispatch(
            addAlert({
                type: "success",
                message: `Sucessfully created a workplace: "${workplace.name}"`,
            })
        );
        dispatch(addWorkplace(workplace));
        setNewModalOpen(false);
    };

    const updateWorkplaceSubmitted = (workplace: Workplace) => {
        dispatch(
            addAlert({
                type: "info",
                message: `Successfuly updated a workplace: "${workplace.name}"`,
            })
        );
        dispatch(
            updateWorkplace({
                id: workplace.id,
                changes: workplace,
            })
        );
        setUpdateModelOpen(false);
    };

    const deleteWorkplaceById = async () => {
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
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <WorkplaceFormAsGenericForm
                        formId={newWorkplaceFormId}
                        onSubmitted={newWorkplaceOnSubmitted}
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
                open={updateModalOpen}
                onClose={() => setUpdateModelOpen(false)}
            >
                <DialogTitle>Update workplace</DialogTitle>
                <DialogContent className={classes.dialog}>
                    <WorkplaceFormAsGenericForm
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

export default WorkplacesPage;
