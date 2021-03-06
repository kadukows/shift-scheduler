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

import { RootState } from "../../../store";
import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import { Schedule } from "../../schedules/scheduleSlice";
import { addShift, Shift } from "../../shifts/shiftSlice";
import { ADD_BY_EVENT_ARG, EventTypes } from "../plannerGridByHours/EventTypes";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { getTokenRequestConfig, TIME_FORMAT } from "../../helpers";
import GenericForm from "../../genericForm/GenericForm";
import { set } from "./addDialogSlice";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";

interface Inputs {
    time_from: Date;
    time_to: Date;
    itemId: number;
}

interface CommonProps<Item> {
    formId: string;
    label: string;
    entitySelector: (state: RootState) => Item[];
    entityToString: (item: Item) => string;
    genRequestData: (arg: ADD_BY_EVENT_ARG, inputs: Inputs) => any;
}

interface Props<Item> extends CommonProps<Item> {}

const GenericAddDialog = <Item extends Role | Employee>({
    ...rest
}: Props<Item>) => {
    const { start, end, secondIndexItemId, open } = useSelector(
        (state: RootState) => state.addDialogReducer
    );
    const dispatch = useDispatch();

    return start && end && secondIndexItemId ? (
        <GenericAddSetDialog
            arg={{
                start,
                end,
                secondIndexItemId,
            }}
            open={open}
            setOpen={(open: boolean) => dispatch(set({ open }))}
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
            validation: yup.date().required(),
            //
            views: ["hours", "day", "month", "year"],
        },
        {
            type: "datetime",
            name: "time_to",
            label: "Time to",
            validation: yup.date().required(),
            //
            views: ["hours", "day", "month", "year"],
        },
        {
            type: "choose_object",
            name: "itemId",
            label,
            validation: yup.number().required(),
            //
            entitySelector,
            entityToString,
        },
    ];

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = async (inputs: Inputs) => {
        const response = await axios.post<Shift>(
            MANAGER_API_ROUTES.shift,
            {
                ...genRequestData(arg, inputs),
                time_from: format(inputs.time_from, TIME_FORMAT),
                time_to: format(inputs.time_to, TIME_FORMAT),
            },
            getTokenRequestConfig(token)
        );

        dispatch(addShift(response.data));
        setOpen(false);
    };

    const defaultValues: any = {
        time_from: new Date(arg.start),
        time_to: new Date(arg.end),
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
