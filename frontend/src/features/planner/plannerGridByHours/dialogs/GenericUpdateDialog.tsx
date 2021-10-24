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
import { Schedule, scheduleSelectors } from "../../../schedules/scheduleSlice";
import { Employee, employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";

interface Inputs {
    time_from: string;
    time_to: string;
    itemId: number;
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";

interface CommonProps<Item> {
    formId: string;
    label: string;
    entitySelector: (schedule: Schedule) => (state: RootState) => Item[];
    entityToString: (item: Item) => string;
    genRequestData: (shift: Shift, inputs: Inputs) => any;
    getDefaultValue: (shift: Shift) => {
        [Property in keyof Inputs]?: string | number;
    };
}

interface Props<Item> extends CommonProps<Item> {
    eventType: EventTypes;
}

const GenericUpdateDialog = <Item extends { id: number }>({
    eventType,
    ...rest
}: Props<Item>) => {
    const [open, setOpen] = React.useState(false);
    const [shift, setShift] = React.useState<Shift>(null);

    const eventCallback = (shift: Shift) => {
        setShift(shift);
        setOpen(true);
    };

    useSlot(eventType, eventCallback);

    return shift !== null ? (
        <GenericSetDialog<Item>
            shift={shift}
            open={open}
            setOpen={setOpen}
            {...rest}
        />
    ) : (
        <React.Fragment />
    );
};

export default GenericUpdateDialog;

interface GenericSetDialogProps<Item> extends CommonProps<Item> {
    shift: Shift;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const GenericSetDialog = <Item extends { id: number }>({
    shift,
    open,
    setOpen,
    label,
    formId,
    entitySelector,
    entityToString,
    genRequestData,
    getDefaultValue,
}: GenericSetDialogProps<Item>) => {
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, shift.schedule)
    );

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
        const response = await axios.put<Shift>(
            `/api/shift/${shift.id}/`,
            genRequestData(shift, inputs),
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
              ...getDefaultValue(shift),
          }
        : undefined;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Update shift</DialogTitle>
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
