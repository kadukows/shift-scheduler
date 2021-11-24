import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Typography,
    Paper,
    Stack,
    styled,
    IconButton,
    Box,
} from "@mui/material";
import { format, parse } from "date-fns";
import { Person as PersonIcon, Edit as EditIcon } from "@mui/icons-material";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
//import { UpdateRoleDialog, AddRoleDialog } from "./RoleDialog";
import {
    GenericAddButton,
    GenericAddDialog,
    GenericAddDialogProps,
    GenericDashboardDataGrid,
    GenericDashboardDataGridProps,
    GenericUpdateDialog,
    GenericUpdateDialogProps,
    WidgetTitle,
} from "../generics";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { getTokenRequestConfig, useEffectWithoutFirst } from "../../helpers";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import {
    ShiftTemplate,
    shiftTemplateActions,
    shiftTemplateSelectors,
} from "../../shiftTemplates/shiftTemplates";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import { addAlert } from "../../alerts/alertsSlice";

interface Props {
    dataGridHeight?: number;
}

const ShiftTemplateWidget = ({ dataGridHeight }: Props) => {
    const height = dataGridHeight ?? 350;

    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addEmployeeDialogProps} />
            <GenericUpdateDialog {...updateEmployeeDialogProps} />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <WidgetTitle>Shift templates</WidgetTitle>
                        <Box sx={{ flex: 1 }} />
                        <GenericAddButton
                            addEvent={EventTypes.SHIFT_TEMPLATE_ADD}
                        />
                    </Box>
                    <Box sx={{ height }}>
                        <GenericDashboardDataGrid {...dataGridProps} />
                    </Box>
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default ShiftTemplateWidget;

/**
 *
 */

const dataGridProps: GenericDashboardDataGridProps<ShiftTemplate> = {
    useItemSelector: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (state) =>
                shiftTemplateSelectors
                    .selectAll(state)
                    .filter((st) => st.workplace === workplaceId),
            [workplaceId]
        );
    },
    useColumnDefs: () => {
        const signalUpdate: CallbackTypes.SHIFT_TEMPLATE_UPDATE = useSignal(
            EventTypes.SHIFT_TEMPLATE_UPDATE
        );

        return React.useMemo(
            () => [
                {
                    field: "id",
                    headerName: "#",
                    type: "number",
                },
                {
                    field: "time_from",
                    headerName: "Time from",
                    flex: 2,
                },
                {
                    field: "time_to",
                    headerName: "Time to",
                    flex: 2,
                },
                {
                    field: "actions",
                    type: "actions",
                    getActions: (params: GridRowParams<ShiftTemplate>) => [
                        <IconButton
                            color="primary"
                            onClick={() =>
                                signalUpdate({ shiftTemplateId: params.row.id })
                            }
                        >
                            <EditIcon />
                        </IconButton>,
                    ],
                },
            ],
            [signalUpdate]
        );
    },
};

/**
 * Dialogs
 */

interface Inputs {
    time_from: Date;
    time_to: Date;
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "time",
        name: "time_from",
        label: "Time from",
        validation: yup.date().required(),
        views: ["hours", "minutes"],
        format: "HH:mm",
    },
    {
        type: "time",
        name: "time_to",
        label: "Time from",
        validation: yup.date().required(),
        views: ["hours", "minutes"],
        format: "HH:mm",
    },
];

const addEmployeeDialogProps: GenericAddDialogProps<Inputs> = {
    addEvent: EventTypes.SHIFT_TEMPLATE_ADD,
    title: "Add shift template",
    fields,
    formId: "ADD_SHIFT_TEMPLATE_WORKPLACE_DASHBOARD_FORM",
    useSubmit: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (dispatch, token) =>
                async ({ time_from, time_to }) => {
                    const res = await axios.post<ShiftTemplate>(
                        MANAGER_API_ROUTES.shiftTemplate,
                        {
                            time_from: format(time_from, "HH:mm"),
                            time_to: format(time_to, "HH:mm"),
                            workplace: workplaceId,
                        },
                        getTokenRequestConfig(token)
                    );

                    dispatch(shiftTemplateActions.addOne(res.data));
                    dispatch(
                        addAlert({
                            type: "info",
                            message: "Added a Shift Template",
                        })
                    );
                },
            [workplaceId]
        );
    },
};

const updateEmployeeDialogProps: GenericUpdateDialogProps<
    CallbackTypes.EMPLOYEE_UPDATE_ARG_TYPE,
    ShiftTemplate,
    Inputs
> = {
    getItemId: (arg) => arg.shiftTemplateId,
    itemSelector: (itemId) => (state) =>
        shiftTemplateSelectors.selectById(state, itemId),
    eventType: EventTypes.SHIFT_TEMPLATE_UPDATE,
    title: "Update Employee",
    formId: "UPDATE_EMPLOYEE_WORKPLACE_DASHBOARD_FORM",
    fields,
    getDefaultValues: ({ time_from, time_to }: ShiftTemplate) => ({
        time_from: parse(time_from, "HH:mm:ss", new Date()),
        time_to: parse(time_to, "HH:mm:ss", new Date()),
    }),
    submit:
        (dispatch, item, token) =>
        async ({ time_from, time_to }) => {
            const res = await axios.put<ShiftTemplate>(
                `${MANAGER_API_ROUTES.shiftTemplate}${item.id}/`,
                {
                    time_from: format(time_from, "HH:mm"),
                    time_to: format(time_to, "HH:mm"),
                    workplace: item.workplace,
                },
                getTokenRequestConfig(token)
            );

            const { id, ...rest } = res.data;
            dispatch(shiftTemplateActions.updateOne({ id, changes: rest }));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully updated an employee: ${id}`,
                })
            );
        },
    onDelete: async (dispatch, shiftTemplateId, token) => {
        await axios.delete(
            `${MANAGER_API_ROUTES.shiftTemplate}${shiftTemplateId}/`,
            getTokenRequestConfig(token)
        );

        dispatch(shiftTemplateActions.removeOne(shiftTemplateId));
        dispatch(
            addAlert({
                type: "info",
                message: `Removed an employee: ${shiftTemplateId}`,
            })
        );
    },
};
