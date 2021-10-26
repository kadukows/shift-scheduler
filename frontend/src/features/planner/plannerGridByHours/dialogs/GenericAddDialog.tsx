import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
} from "@mui/material";

import { RootState } from "../../../../store";
import { Employee } from "../../../employees/employeeSlice";
import { Role } from "../../../roles/rolesSlice";
import { Schedule } from "../../../schedules/scheduleSlice";
import { addShift, Shift } from "../../../shifts/shiftSlice";
import { ADD_BY_EVENT_ARG, EventTypes } from "../EventTypes";
import { useSlot } from "../../../eventProvider/EventProvider";
import { FieldData } from "../../../genericForm/fieldInstance/Field";
import { getTokenRequestConfig } from "../../../helpers";
import GenericForm from "../../../genericForm/GenericForm";

interface Inputs {
    time_from: string;
    time_to: string;
    itemId: number;
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";

interface CommonProps<Item> {
    formId: string;
    label: string;
    schedule: Schedule;
    entitySelector: (item: Schedule) => (state: RootState) => Item[];
    entityToString: (item: Item) => string;
    genRequestData: (arg: ADD_BY_EVENT_ARG, inputs: Inputs) => any;
}

interface Props<Item> extends CommonProps<Item> {
    eventType: EventTypes;
}

const GenericAddDialog = <Item extends Role | Employee>({
    eventType,
    ...rest
}: Props<Item>) => {
    const [open, setOpen] = React.useState(false);
    const [arg, setArg] = React.useState<ADD_BY_EVENT_ARG>(null);

    const eventCallback = (newArg: ADD_BY_EVENT_ARG) => {
        setArg(newArg);
        setOpen(true);
    };

    useSlot(eventType, eventCallback);

    return arg ? (
        <GenericAddSetDialog
            arg={arg}
            open={open}
            setOpen={setOpen}
            {...rest}
        />
    ) : (
        <React.Fragment />
    );
};

export default GenericAddDialog;

interface GenericAddDialogProps<Item> extends CommonProps<Item> {
    arg: ADD_BY_EVENT_ARG;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const GenericAddSetDialog = <Item extends Role | Employee>({
    arg,
    open,
    setOpen,
    label,
    schedule,
    formId,
    entitySelector,
    entityToString,
    genRequestData,
}: GenericAddDialogProps<Item>) => {
    const fields: FieldData<Inputs, Item>[] = [
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
            name: "itemId",
            label,
            validation: yup.number().required(),
            //
            entitySelector: entitySelector(schedule),
            entityToString,
        },
    ];

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = async (inputs: Inputs) => {
        const response = await axios.post<Shift>(
            `/api/shift/`,
            genRequestData(arg, inputs),
            getTokenRequestConfig(token)
        );

        dispatch(addShift(response.data));
        setOpen(false);
    };

    const defaultValues: any = {
        time_from: format(arg.start, TIME_FORMAT),
        time_to: format(arg.end, TIME_FORMAT),
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add shift</DialogTitle>
            <DialogContent>
                <GenericForm
                    fields={fields}
                    submit={submit}
                    formId={formId}
                    defaultValues={defaultValues}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>Close</Button>
                <Button type="submit" form={formId}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};