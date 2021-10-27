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

import {
    removeShift,
    Shift,
    shiftSelectors,
    updateShift,
} from "../../../shifts/shiftSlice";
import { useSlot } from "../../../eventProvider/EventProvider";
import { EventTypes } from "../EventTypes";
import { FieldData } from "../../../genericForm/fieldInstance/Field";
import GenericForm from "../../../genericForm/GenericForm";
import { getTokenRequestConfig } from "../../../helpers";
import { RootState } from "../../../../store";
import { Schedule, scheduleSelectors } from "../../../schedules/scheduleSlice";
import { addAlert } from "../../../alerts/alertsSlice";
import { set as updateDialogSet } from "../updateDialogSlice";

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

interface Props<Item> extends CommonProps<Item> {}

const GenericUpdateDialog = <Item extends { id: number }>({
    ...rest
}: Props<Item>) => {
    const shiftId = useSelector(
        (state: RootState) => state.updateDialogReducer.shiftId
    );

    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    return shift ? (
        <GenericSetDialog<Item> shift={shift} {...rest} />
    ) : (
        <React.Fragment />
    );
};

export default GenericUpdateDialog;

interface GenericSetDialogProps<Item> extends CommonProps<Item> {
    shift: Shift;
}

const GenericSetDialog = <Item extends { id: number }>({
    label,
    shift,
    formId,
    entitySelector,
    entityToString,
    genRequestData,
    getDefaultValue,
}: GenericSetDialogProps<Item>) => {
    const { open } = useSelector(
        (state: RootState) => state.updateDialogReducer
    );

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
        dispatch(updateDialogSet({ open: false }));
    };

    const deleteOnClick = async () => {
        dispatch(updateDialogSet({ open: false }));
        await axios.delete(
            `/api/shift/${shift.id}/`,
            getTokenRequestConfig(token)
        );
        dispatch(removeShift(shift.id));
        dispatch(
            addAlert({
                type: "info",
                message: `Sucessfully deleted shift: ${shift.id}`,
            })
        );
    };

    const defaultValues: any = shift
        ? {
              time_from: format(Date.parse(shift.time_from), TIME_FORMAT),
              time_to: format(Date.parse(shift.time_to), TIME_FORMAT),
              ...getDefaultValue(shift),
          }
        : undefined;

    return (
        <Dialog
            open={open}
            onClose={() => dispatch(updateDialogSet({ open: false }))}
        >
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
                <Button onClick={deleteOnClick} color="secondary">
                    Delete
                </Button>
                <div style={{ flex: 1 }} />
                <Button
                    onClick={() => dispatch(updateDialogSet({ open: false }))}
                >
                    Close
                </Button>
                <Button type="submit" form={formId}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};
