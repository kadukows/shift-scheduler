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
import { parse, format } from "date-fns";

import { Shift, updateShift } from "../../../shifts/shiftSlice";
import { useSlot } from "../../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "../EventTypes";
import { Role, roleSelectors } from "../../../roles/rolesSlice";
import { FieldData } from "../../../genericForm/fieldInstance/Field";
import GenericForm from "../../../genericForm/GenericForm";
import { getTokenRequestConfig } from "../../../helpers";
import { RootState } from "../../../../store";
import { Schedule, scheduleSelectors } from "../../../schedules/scheduleSlice";

interface Inputs {
    time_from: string;
    time_to: string;
    role: number;
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";
const FORM_ID = "PLANNER_GRID_BY_HOURS__EMPLOYEE_DIALOG_FORM";

const EmployeeDialog = () => {
    const [open, setOpen] = React.useState(false);
    const [shift, setShift] = React.useState<Shift>(null);

    const eventCallback: CallbackTypes.EMPLOYEE_ITEM_CLICK = (shift: Shift) => {
        setShift(shift);
        setOpen(true);
    };

    useSlot(EventTypes.EMPLOYEE_ITEM_CLICK, eventCallback);

    return shift ? (
        <EmployeeSetDialog shift={shift} open={open} setOpen={setOpen} />
    ) : (
        <React.Fragment />
    );
};

export default EmployeeDialog;

interface EmployeeSetDialogProps {
    shift: Shift;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const EmployeeSetDialog = ({
    shift,
    open,
    setOpen,
}: EmployeeSetDialogProps) => {
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, shift.schedule)
    );

    const fields = React.useMemo(() => {
        const entitySelector = (state: RootState) =>
            roleSelectors
                .selectAll(state)
                .filter((role) => role.workplace === schedule.workplace);

        const fields: FieldData<Inputs, Role>[] = [
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
                name: "role",
                label: "Role",
                validation: yup.number().required(),
                //
                entitySelector,
                entityToString: (role: Role) => role.name,
            },
        ];

        return fields;
    }, [schedule.workplace]);

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = async ({ time_from, time_to, role }: Inputs) => {
        const response = await axios.put<Shift>(
            `/api/shift/${shift.id}/`,
            {
                time_from,
                time_to,
                role,
                id: shift.id,
                employee: shift.employee,
                schedule: shift.schedule,
            },
            getTokenRequestConfig(token)
        );

        dispatch(updateShift(response.data as any));
        setOpen(false);
    };

    const defaultValues: any = shift
        ? {
              time_from: format(Date.parse(shift.time_from), TIME_FORMAT),
              time_to: format(Date.parse(shift.time_to), TIME_FORMAT),
              role: shift.role,
              schedule: shift.schedule,
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
