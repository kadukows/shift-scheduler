import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { format } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    Button,
} from "@material-ui/core";

import GenericForm from "../../genericForm/GenericForm";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { ChooseObjectIdFieldData } from "../../genericForm/fieldInstance/ChooseObjectIdField";
import { Schedule } from "../../schedules/scheduleSlice";
import { Employee } from "../../employees/employeeSlice";
import { useSlot } from "../../eventProvider/EventProvider";
import EventTypes, { CallbackTypes } from "../EventTypes";
import { getTokenRequestConfig } from "../../helpers";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store";
import { Shift, addShift } from "../../shifts/shiftSlice";
import { addAlert } from "../../alerts/alertsSlice";
import { getFieldDataArray } from "./helpers";

interface Props {
    schedule: Schedule;
}

interface Inputs {
    time_from: string;
    time_to: string;
    role: number;
}

const FORM_ID = "EMPTY_ITEM_FORM_ID";
const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";

const EmptyItemDialog = ({ schedule }: Props) => {
    const fields = getFieldDataArray<Inputs>(schedule, "Role", TIME_FORMAT);

    //

    const auth = useSelector((state: RootState) => state.authReducer);
    const dispatch = useDispatch();

    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date>(null);
    const [employee, setEmployee] = React.useState<Employee>(null);

    //

    useSlot(EventTypes.EMPTY_FIELD_CLICKED, ((date, secondIdx, payload) => {
        setDate(date);
        if (secondIdx !== "Employee") {
            throw new Error("EmptyItemDialog: did not get an employee");
        }
        setEmployee(payload as Employee);
        setOpen(true);
    }) as CallbackTypes.EMPTY_FIELD_CLICKED);

    //

    const onSubmit = async ({ time_from, time_to, role }: Inputs) => {
        const reqData = {
            time_from,
            time_to,
            role,
            schedule: schedule.id,
            employee: employee.id,
        };

        const res = await axios.post<Shift>(
            "/api/shift/",
            reqData,
            getTokenRequestConfig(auth.token)
        );

        dispatch(addShift(res.data));
        dispatch(
            addAlert({
                type: "success",
                message: "Sucessfully added a shift",
            })
        );
        setOpen(false);
    };

    //

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add shift</DialogTitle>
            <DialogContent>
                <GenericForm
                    fields={fields}
                    submit={onSubmit}
                    formId={FORM_ID}
                    defaultValues={{
                        time_from: date ? format(date, TIME_FORMAT) : undefined,
                        time_to: date ? format(date, TIME_FORMAT) : undefined,
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)} color="primary">
                    Cancel
                </Button>
                <Button form={FORM_ID} type="submit" color="primary">
                    Add shift
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EmptyItemDialog;
