import * as React from "react";
import axios from "axios";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Typography,
    Button,
    Box,
} from "@mui/material";
import { useSlot } from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { employeeSelectors, Employee, employeeActions } from "./employeeSlice";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { getTokenRequestConfig } from "../../helpers";
import { refreshEmployeeData } from "../helpers";
import { employeeToString } from "../../employees/helpers";
import { addAlert } from "../../alerts/alertsSlice";

const DeleteEmploymentDialog = () => {
    const [employeeId, setEmployeeId] = React.useState<number | null>(null);
    const [open, setOpen] = React.useState(false);

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, employeeId)
    );

    const useSlotCallback: CallbackTypes.DELETE_EMPLOYMENT = ({
        employeeId,
    }) => {
        setEmployeeId(employeeId);
        setOpen(true);
    };
    useSlot(EventTypes.DELETE_EMPLOYMENT, useSlotCallback, [
        setEmployeeId,
        setOpen,
    ]);

    return employee ? (
        <DeleteEmploymentDialogImpl
            employee={employee}
            open={open}
            setOpen={setOpen}
        />
    ) : (
        <React.Fragment />
    );
};

export default DeleteEmploymentDialog;

/**
 *
 */

interface ImplProps {
    employee: Employee;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const DeleteEmploymentDialogImpl = ({ employee, open, setOpen }: ImplProps) => {
    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.authReducer.token);

    const submit = React.useCallback(async () => {
        try {
            await axios.delete(
                EMPLOYEE_API_ROUTES.employeeDeleteBinding(employee.id),
                getTokenRequestConfig(token)
            );

            refreshEmployeeData(dispatch);

            dispatch(employeeActions.removeOne(employee.id));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully deleted employment: ${employeeToString(
                        employee
                    )}`,
                })
            );
        } catch (e) {
            console.log(e);
        }
    }, [employee.id, token, dispatch, employeeToString(employee)]);

    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Unbind employment</DialogTitle>
            <DialogContent>
                <Typography>
                    Are you sure you want to unbind this employment?
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={submit}>
                    Delete
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button onClick={handleClose}>Cancel</Button>
            </DialogActions>
        </Dialog>
    );
};
