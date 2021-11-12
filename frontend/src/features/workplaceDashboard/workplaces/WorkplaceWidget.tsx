import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { Stack, Paper, Typography, styled, IconButton } from "@mui/material";
import {
    Edit as EditIcon,
    List as ListIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import EventProvider from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericAddButton,
    GenericAddDialog,
    GenericAddDialogProps,
    GenericUpdateDialog,
    GenericUpdateDialogProps,
    GenericDashboardDataGrid,
    GenericDashboardDataGridProps,
} from "../generics";
import {
    addWorkplace,
    removeWorkplace,
    updateWorkplace,
    Workplace,
    workplaceSelectors,
} from "../../workplaces/workplaceSlice";
import { GridRowParams } from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { getTokenRequestConfig } from "../../helpers";
import { addAlert } from "../../alerts/alertsSlice";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";

const WorkplaceWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addWorkplaceDialogProps} />
            <GenericUpdateDialog {...updateWorkplaceDialogProps} />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Stack direction="row">
                        <Typography variant="h4" component="h4">
                            Workplaces <BusinessIcon />
                        </Typography>
                        <Spacer />
                        <GenericAddButton addEvent={EventTypes.ADD_WORKPLACE} />
                    </Stack>
                    <GenericDashboardDataGrid {...dataGridProps} />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default WorkplaceWidget;

/**
 *
 */

const Spacer = styled("div")({
    flex: 1,
});

const dataGridProps: GenericDashboardDataGridProps<Workplace> = {
    useItemSelector: () => {
        return workplaceSelectors.selectAll;
    },
    updateEvent: EventTypes.UPDATE_WORKPLACE,
    useColumnDefs: (signal: CallbackTypes.UPDATE_WORKPLACE) => {
        const history = useHistory();

        return [
            {
                field: "id",
                headerName: "#",
                type: "number",
            },
            {
                field: "name",
                headerName: "Name",

                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                getActions: (params: GridRowParams<Workplace>) => [
                    <IconButton
                        color="primary"
                        onClick={() => signal({ workplaceId: params.row.id })}
                    >
                        <EditIcon />
                    </IconButton>,
                    <IconButton
                        color="primary"
                        onClick={() =>
                            history.push(`/workplaceDashboard/${params.row.id}`)
                        }
                    >
                        <ListIcon />
                    </IconButton>,
                ],
            },
        ];
    },
};

interface Inputs {
    name: string;
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "string",
        name: "name",
        label: "Name",
        validation: yup.string().required(),
    },
];

const addWorkplaceDialogProps: GenericAddDialogProps<Inputs> = {
    addEvent: EventTypes.ADD_WORKPLACE,
    title: "Add workplace",
    fields,
    useSubmit: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (dispatch, token) =>
                async ({ name }) => {
                    const res = await axios.post<Workplace>(
                        MANAGER_API_ROUTES.workplace,
                        {
                            name,
                        },
                        getTokenRequestConfig(token)
                    );

                    dispatch(addWorkplace(res.data));
                    dispatch(
                        addAlert({
                            type: "info",
                            message: `Added a schedule: ${res.data.name}`,
                        })
                    );
                },
            [workplaceId]
        );
    },
};

const updateWorkplaceDialogProps: GenericUpdateDialogProps<
    CallbackTypes.UPDATE_WORPLACE_ARG_TYPE,
    Workplace,
    Inputs
> = {
    getItemId: (arg) => arg.workplaceId,
    itemSelector: (itemId) => (state) =>
        workplaceSelectors.selectById(state, itemId),
    eventType: EventTypes.UPDATE_WORKPLACE,
    title: "Update Workplace",
    fields,
    getDefaultValues: (workplace) => ({ name: workplace.name }),
    submit:
        (dispatch, item, token) =>
        async ({ name }) => {
            const res = await axios.put<Workplace>(
                `${MANAGER_API_ROUTES.workplace}${item.id}/`,
                {
                    name,
                },
                getTokenRequestConfig(token)
            );

            const { id, ...rest } = res.data;
            dispatch(
                updateWorkplace({
                    id,
                    changes: rest,
                })
            );

            dispatch(
                addAlert({
                    type: "info",
                    message: `Updated a workplace: ${id}`,
                })
            );
        },
    onDelete: async (dispatch, workplaceId, token) => {
        await axios.delete(
            `${MANAGER_API_ROUTES.workplace}${workplaceId}/`,
            getTokenRequestConfig(token)
        );

        dispatch(removeWorkplace(workplaceId));
        dispatch(
            addAlert({
                type: "info",
                message: `Removed a workplace: ${workplaceId}`,
            })
        );
    },
};
