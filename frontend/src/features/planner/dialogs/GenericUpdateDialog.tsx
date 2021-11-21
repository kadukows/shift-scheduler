import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Button,
    ButtonGroup,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    styled,
} from "@mui/material";
import { DateRange } from "@mui/lab";
import { useSelector, useDispatch, batch } from "react-redux";
import { eachDayOfInterval, endOfMonth, format, parse } from "date-fns";
import {
    addShifts,
    removeShift,
    Shift,
    shiftSelectors,
    updateShift,
} from "../../shifts/shiftSlice";
import { useSlot } from "../../eventProvider/EventProvider";
import { EventTypes } from "../plannerGridByHours/EventTypes";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import GenericForm from "../../genericForm/GenericForm";
import { getTokenRequestConfig, TIME_FORMAT } from "../../helpers";
import { RootState } from "../../../store";
import { Schedule, scheduleSelectors } from "../../schedules/scheduleSlice";
import { addAlert } from "../../alerts/alertsSlice";
import { set as updateDialogSet } from "./updateDialogSlice";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import { FilterTiltShiftRounded } from "@mui/icons-material";

interface Inputs {
    time_from: Date;
    time_to: Date;
    itemId: number;
}

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

    const fields: FieldData<Inputs, Item>[] = React.useMemo(
        () => [
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
                entitySelector: entitySelector(schedule),
                entityToString,
            },
        ],
        [schedule]
    );

    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = React.useCallback(
        async (inputs: Inputs) => {
            const response = await axios.put<Shift>(
                `${MANAGER_API_ROUTES.shift}${shift.id}/`,
                {
                    ...genRequestData(shift, inputs),
                    time_from: format(inputs.time_from, TIME_FORMAT),
                    time_to: format(inputs.time_to, TIME_FORMAT),
                },
                getTokenRequestConfig(token)
            );

            const { id, ...changes } = response.data;

            batch(() => {
                dispatch(
                    updateShift({
                        id,
                        changes: { ...changes },
                    })
                );
                dispatch(updateDialogSet({ open: false }));
                dispatch(
                    addAlert({
                        type: "success",
                        message: `Successfully update shift: ${id}`,
                    })
                );
            });
        },
        [token, shift]
    );

    const submitBatchCopy = React.useCallback(
        async (inputs: BatchCopyInputs) => {
            const days = eachDayOfInterval({
                start: inputs.dateRange[0],
                end: inputs.dateRange[1],
            });

            const res = await axios.post<Shift[]>(
                MANAGER_API_ROUTES.shiftBatchCopy(shift.id),
                days.map((date) => ({ date: format(date, "yyyy-MM-dd") })),
                getTokenRequestConfig(token)
            );

            dispatch(updateDialogSet({ open: false }));
            dispatch(addShifts(res.data));
            dispatch(
                addAlert({
                    type: "success",
                    message: `Copied a total of ${res.data.length} shifts!`,
                })
            );
        },
        [token, shift]
    );

    const deleteOnClick = async () => {
        dispatch(updateDialogSet({ open: false }));

        await axios.delete(
            `${MANAGER_API_ROUTES.shift}${shift.id}/`,
            getTokenRequestConfig(token)
        );

        batch(() => {
            dispatch(removeShift(shift.id));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Sucessfully deleted shift: ${shift.id}`,
                })
            );
        });
    };

    const defaultValues: any = shift
        ? {
              ...getDefaultValue(shift),
              time_from: new Date(shift.time_from),
              time_to: new Date(shift.time_to),
          }
        : undefined;

    const firstOfTheMonth = parse(schedule.month_year, "MM.yyyy", new Date());
    const defaultValuesBatchCopy = {
        dateRange: [
            firstOfTheMonth,
            endOfMonth(firstOfTheMonth),
        ] as DateRange<Date>,
    };

    console.log("defaultValuesBatchCopy: ", defaultValuesBatchCopy);

    const [tab, setTab] = React.useState(Tab.Update);
    const updateTabButtonClick = React.useCallback(
        () => setTab(Tab.Update),
        [setTab]
    );
    const batchCopyTabButtonClick = React.useCallback(
        () => setTab(Tab.BatchCopy),
        [setTab]
    );

    const onCloseCallback = React.useCallback(
        () => dispatch(updateDialogSet({ open: false })),
        [dispatch]
    );

    return (
        <Dialog open={open} onClose={onCloseCallback} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
            >
                <Button
                    variant="text"
                    disabled={tab === Tab.Update}
                    onClick={updateTabButtonClick}
                >
                    Update
                </Button>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="text"
                    disabled={tab === Tab.BatchCopy}
                    onClick={batchCopyTabButtonClick}
                >
                    Batch copy
                </Button>
            </DialogTitle>
            <DialogContent>
                <div hidden={tab !== Tab.Update}>
                    <GenericForm
                        fields={fields}
                        submit={submit}
                        formId={getFormId(formId, Tab.Update)}
                        defaultValues={defaultValues}
                    />
                </div>
                <div hidden={tab !== Tab.BatchCopy}>
                    <GenericForm
                        fields={batchFields}
                        submit={submitBatchCopy}
                        formId={getFormId(formId, Tab.BatchCopy)}
                        defaultValues={defaultValuesBatchCopy}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteOnClick} color="secondary">
                    Delete
                </Button>
                <Box sx={{ flex: 1 }} />
                <Button
                    onClick={() => dispatch(updateDialogSet({ open: false }))}
                >
                    Close
                </Button>
                <Button type="submit" form={getFormId(formId, tab)}>
                    Submit
                </Button>
            </DialogActions>
        </Dialog>
    );
};

enum Tab {
    Update = "Update",
    BatchCopy = "BatchCopy",
}

interface BatchCopyInputs {
    dateRange: DateRange<Date>;
}

const batchFields: FieldData<BatchCopyInputs, any>[] = [
    {
        type: "datetime_range",
        name: "dateRange",
    },
];

const getFormId = (baseFormId: string, tab: Tab) => baseFormId + tab;
