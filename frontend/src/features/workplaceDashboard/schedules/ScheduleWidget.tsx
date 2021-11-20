import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Paper,
    Stack,
    Typography,
    styled,
    IconButton,
    Box,
} from "@mui/material";
import {
    Edit as EditIcon,
    Schedule as ScheduleIcon,
    InsertInvitation as InsertInvitationIcon,
} from "@mui/icons-material";
import { format, parse } from "date-fns";
import { useHistory } from "react-router-dom";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericAddButton,
    GenericAddDialog,
    GenericAddDialogProps,
    GenericDashboardDataGrid,
    GenericDashboardDataGridProps,
    GenericUpdateDialog,
    GenericUpdateDialogProps,
} from "../generics";
import {
    Schedule,
    scheduleSelectors,
    addSchedule,
    updateSchedule,
    removeSchedule,
} from "../../schedules/scheduleSlice";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { GridRowParams } from "@mui/x-data-grid";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { getTokenRequestConfig } from "../../helpers";
import { addAlert } from "../../alerts/alertsSlice";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";

interface Props {
    dataGridHeight?: number;
}

const ScheduleWidget = ({ dataGridHeight }: Props) => {
    const height = dataGridHeight ?? 350;

    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addScheduleDialogProps} />
            <GenericUpdateDialog {...updateScheduleDialogProps} />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Stack direction="row">
                        <Typography variant="h4" component="h4">
                            Schedules <ScheduleIcon />
                        </Typography>
                        <Spacer />
                        <GenericAddButton addEvent={EventTypes.SCHEDULE_ADD} />
                    </Stack>
                    <Box sx={{ height }}>
                        <GenericDashboardDataGrid {...dataGridProps} />
                    </Box>
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default ScheduleWidget;

/**
 *  Helpers
 */

const Spacer = styled("div")({
    flex: 1,
});

/**
 * Data Grid
 */

const dataGridProps: GenericDashboardDataGridProps<Schedule> = {
    useItemSelector: () => {
        const workplaceId = useWorkplaceId();
        return React.useCallback(
            (state: RootState) =>
                scheduleSelectors
                    .selectAll(state)
                    .filter((schedule) => schedule.workplace === workplaceId),
            [workplaceId]
        );
    },
    useColumnDefs: () => {
        const history = useHistory();
        const signal: CallbackTypes.SCHEDULE_UPDATE = useSignal(
            EventTypes.SCHEDULE_UPDATE
        );

        return [
            {
                field: "id",
                headerName: "#",
                type: "number",
            },
            {
                field: "month_year",
                headerName: "Month",
                flex: 5,
            },
            {
                field: "published",
                headerName: "Published",
                flex: 1,
                type: "boolean",
            },
            {
                field: "actions",
                type: "actions",
                getActions: (params: GridRowParams<Schedule>) => [
                    <IconButton
                        color="primary"
                        onClick={() => signal({ scheduleId: params.row.id })}
                    >
                        <EditIcon />
                    </IconButton>,
                    <IconButton
                        color="primary"
                        onClick={() =>
                            history.push(`/planner/${params.row.id}`)
                        }
                    >
                        <InsertInvitationIcon />
                    </IconButton>,
                ],
            },
        ];
    },
};

/**
 * Dialogs
 */

interface Inputs {
    month_year: Date;
    published: boolean;
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "date",
        name: "month_year",
        label: "Month",
        validation: yup.date().required() as any,
        //
        views: ["month", "year"],
        format: "",
    },
    {
        type: "check",
        name: "published",
        label: "Published",
    },
];

const TIME_FORMAT = "MM.yyyy";

const addScheduleDialogProps: GenericAddDialogProps<Inputs> = {
    addEvent: EventTypes.SCHEDULE_ADD,
    title: "Add Schedule",
    fields,
    useSubmit: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (dispatch, token) =>
                async ({ month_year }) => {
                    const res = await axios.post<Schedule>(
                        MANAGER_API_ROUTES.schedule,
                        {
                            month_year: format(month_year, TIME_FORMAT),
                            workplace: workplaceId,
                        },
                        getTokenRequestConfig(token)
                    );

                    dispatch(addSchedule(res.data));
                    dispatch(
                        addAlert({
                            type: "info",
                            message: `Added a schedule: ${res.data.month_year}`,
                        })
                    );
                },
            [workplaceId]
        );
    },
};

const updateScheduleDialogProps: GenericUpdateDialogProps<
    CallbackTypes.SCHEDULE_UPDATE_ARG_TYPE,
    Schedule,
    Inputs
> = {
    getItemId: (arg) => arg.scheduleId,
    itemSelector: (itemId) => (state) =>
        scheduleSelectors.selectById(state, itemId),
    eventType: EventTypes.SCHEDULE_UPDATE,
    title: "Update Schedule",
    fields,
    getDefaultValues: (schedule: Schedule) => ({
        month_year: parse(schedule.month_year, TIME_FORMAT, new Date()),
        published: schedule.published,
    }),
    submit:
        (dispatch, item, token) =>
        async ({ month_year, published }) => {
            const res = await axios.put<Schedule>(
                `${MANAGER_API_ROUTES.schedule}${item.id}/`,
                {
                    month_year: format(month_year, TIME_FORMAT),
                    workplace: item.workplace,
                    published: published,
                },
                getTokenRequestConfig(token)
            );

            const { id, ...rest } = res.data;
            dispatch(
                updateSchedule({
                    id,
                    changes: rest,
                })
            );

            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully updated a schedule: ${id}`,
                })
            );
        },
    onDelete: async (dispatch, scheduleId, token) => {
        await axios.delete(
            `${MANAGER_API_ROUTES.schedule}${scheduleId}/`,
            getTokenRequestConfig(token)
        );

        dispatch(removeSchedule(scheduleId));
        dispatch(
            addAlert({
                type: "info",
                message: `Removed a schedule: ${scheduleId}`,
            })
        );
    },
};
