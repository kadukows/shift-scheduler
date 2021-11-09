import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { Paper, Stack, Typography, styled, IconButton } from "@mui/material";
import {
    Edit as EditIcon,
    Schedule as ScheduleIcon,
    InsertInvitation as InsertInvitationIcon,
} from "@mui/icons-material";
import { format } from "date-fns";
import { useHistory } from "react-router-dom";
import EventProvider from "../../eventProvider/EventProvider";
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

const ScheduleWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addScheduleDialogProps} />
            {/* TODO */}
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Stack direction="row">
                        <Typography variant="h4" component="h4">
                            Schedules <ScheduleIcon />
                        </Typography>
                        <Spacer />
                        <GenericAddButton addEvent={EventTypes.SCHEDULE_ADD} />
                    </Stack>
                    <GenericDashboardDataGrid {...dataGridProps} />
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

const scheduleByWorkplaceSelector = createSelector(
    [
        (state: RootState) => scheduleSelectors.selectAll(state),
        (state: RootState, workplaceId: number) => workplaceId,
    ],
    (schedules, workplaceId) =>
        schedules.filter((schedule) => schedule.workplace === workplaceId)
);

const dataGridProps: GenericDashboardDataGridProps<Schedule> = {
    useItemSelector: () => {
        const workplaceId = useWorkplaceId();
        return (state) => scheduleByWorkplaceSelector(state, workplaceId);
    },
    updateEvent: EventTypes.SCHEDULE_UPDATE,
    useColumnDefs: (signal: CallbackTypes.SCHEDULE_UPDATE) => {
        const history = useHistory();

        return [
            {
                field: "id",
                headerName: "#",
                type: "number",
            },
            {
                field: "month_year",
                headerName: "Month",
                flex: 1,
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
                        "/api/schedule/",
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
        month_year: schedule.month_year,
    }),
    submit:
        (dispatch, item, token) =>
        async ({ month_year }) => {
            const res = await axios.put<Schedule>(
                `/api/schedule/${item.id}/`,
                {
                    month_year,
                    workplace: item.workplace,
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
            `/api/schedule/${scheduleId}/`,
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
