import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import { Shift, updateShift } from "../../../shifts/shiftSlice";
import { useSlot } from "../../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "../EventTypes";
import { Role, roleSelectors } from "../../../roles/rolesSlice";
import { FieldData } from "../../../genericForm/fieldInstance/Field";
import GenericForm from "../../../genericForm/GenericForm";
import { getTokenRequestConfig } from "../../../helpers";
import { RootState } from "../../../../store";
import { scheduleSelectors } from "../../../schedules/scheduleSlice";
import { Employee, employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";

interface Inputs {
    time_from: string;
    time_to: string;
    employee: number;
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";
const FORM_ID = "PLANNER_GRID_BY_HOURS__EMPLOYEE_DIALOG_FORM";

const RoleDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [shift, setShift] = React.useState<Shift>(null);

    const eventCallback: CallbackTypes.ROLE_ITEM_CLICK = (shift: Shift) => {
        setShift(shift);
        setOpen(true);
    };

    useSlot(EventTypes.ROLE_ITEM_CLICK, eventCallback);

    return shift ? (
        <RoleSetDialog shift={shift} open={open} setOpen={setOpen} />
    ) : (
        <React.Fragment />
    );
};

export default RoleDialog;

interface RoleSetDialogProps {
    shift: Shift;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const RoleSetDialog = ({ shift, open, setOpen }: RoleSetDialogProps) => {
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, shift.schedule)
    );

    const fields = React.useMemo(() => {
        const entitySelector = (state: RootState) =>
            employeeSelectors
                .selectAll(state)
                .filter(
                    (employee) => employee.workplace === schedule.workplace
                );

        const fields: FieldData<Inputs, Employee>[] = [
            {
                type: "datetime",
                name: "time_from",
                label: "Time from",
                validation: yup.string().required(),
                //
                views: ["hours", "day", "month", "year"],
                format: TIME_FORMAT,
            },
            {
                type: "datetime",
                name: "time_to",
                label: "Time to",
                validation: yup.string().required(),
                //
                views: ["hours", "day", "month", "year"],
                format: TIME_FORMAT,
            },
            {
                type: "choose_object",
                name: "employee",
                label: "Employee",
                validation: yup.number().required(),
                //
                entitySelector,
                entityToString: employeeToString,
            },
        ];

        return fields;
    }, [schedule.workplace]);

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = async ({ time_from, time_to, employee }: Inputs) => {
        const response = await axios.put<Shift>(
            `/api/shift/${shift.id}/`,
            {
                time_from,
                time_to,
                role: shift.role,
                id: shift.id,
                employee: employee,
                schedule: shift.schedule,
            },
            getTokenRequestConfig(token)
        );

        const { id, ...changes } = response.data;

        dispatch(
            updateShift({
                id,
                changes: { ...changes },
            })
        );
        setOpen(false);
    };

    const defaultValues: any = shift
        ? {
              time_from: format(Date.parse(shift.time_from), TIME_FORMAT),
              time_to: format(Date.parse(shift.time_to), TIME_FORMAT),
              employee: shift.employee,
          }
        : undefined;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Update shift</DialogTitle>
            <DialogContent>
                <GenericForm
                    fields={fields}
                    submit={submit}
                    formId={FORM_ID}
                    defaultValues={defaultValues}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
                <Button type="submit" form={FORM_ID}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
