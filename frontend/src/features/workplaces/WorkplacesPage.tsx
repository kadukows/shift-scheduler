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
const deleteWorkplaceFormId = "delete-workplace-form";

const WorkplacesPage = () => {
    const classes = useStyles();
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.authReducer);
    const [newModalOpen, setNewModalOpen] = React.useState(false);
    const [deleteModalState, setDeleteModalState] = React.useState({
        open: false,
        ids: [] as number[],
    });
    const gridRef = React.useRef<typeof AgGridReact>(null);

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

    const deleteWorkplacesSubmitted = async ({
        ids,
    }: WorkplaceDeleteFormInputs) => {
        for (const id of ids) {
            try {
                await axios.delete(
                    `/api/workplace/${id}/`,
                    getTokenRequestConfig(auth.token)
                );
            } catch (err) {
                // pass
            }
        }

        dispatch(removeWorkplaces(ids));
        dispatch(
            addAlert({
                type: "info",
                message: "Sucessfully deleted workplaces.",
            })
        );
    };

    return (
        <>
            <Dialog open={newModalOpen} onClose={() => setNewModalOpen(false)}>
                <DialogTitle>Add a workplace</DialogTitle>
                <DialogContent>
                    <WorkplaceDeleteForm
                        formId={deleteWorkplaceFormId}
                        submit={deleteWorkplaces}
                        ids={[]}
                    />
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
                        form={newWorkplaceFormId}
                        variant="contained"
                    >
                        Add workplace
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={deleteModalState.open}
                onClose={() => setDeleteModalState({ open: false, ids: [] })}
            >
                <DialogTitle>Remove workplaces</DialogTitle>
                <DialogContent>
                    <WorkplaceDeleteForm
                        formId={deleteWorkplaceFormId}
                        submit={deleteWorkplacesSubmitted}
                        ids={deleteModalState.ids}
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        color="primary"
                        onClick={() =>
                            setDeleteModalState({ open: false, ids: [] })
                        }
                        variant="contained"
                    >
                        Close
                    </Button>
                    <Button
                        color="primary"
                        type="submit"
                        form={deleteWorkplaceFormId}
                        variant="contained"
                    >
                        Add workplace
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
                        <WorkplacesAgGrid gridRef={gridRef} />
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
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setDeleteModalOpen({open: true, ids: gridRef.current.})}
                                >
                                    Delete
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
