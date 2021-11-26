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
import {
    format,
    parse,
    compareAsc,
    eachDayOfInterval,
    isSameDay,
} from "date-fns";
import { useSelector } from "react-redux";
import {
    Person as PersonIcon,
    Edit as EditIcon,
    Add as AddIcon,
} from "@mui/icons-material";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
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
import {
    GridActionsCellItem,
    GridRowParams,
    GridValueFormatterParams,
} from "@mui/x-data-grid";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { getTokenRequestConfig, useEffectWithoutFirst } from "../../helpers";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import {
    LA_Type,
    LimitedAvailability,
    limitedAvailabilityActions,
    limitedAvailabilitySelectors,
} from "../../limitedAvailability/limitedAvailablitySlice";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import { addAlert } from "../../alerts/alertsSlice";
import { isEqual } from "date-fns/esm";
import {
    ShiftTemplate,
    shiftTemplateSelectors,
} from "../../shiftTemplates/shiftTemplates";
import { ChooseObjectIdFieldData } from "../../genericForm/fieldInstance/ChooseObjectIdField";
import CreateEmployeeAvailabilityDialog from "./CreateEmployeeAvailabilityDialog";

interface Props {
    dataGridHeight?: number;
    employeeId: number;
    start: number;
    end: number;
}

const EmployeeAvailabilityWidget = ({
    dataGridHeight,
    employeeId,
    start,
    end,
}: Props) => {
    const height = dataGridHeight ?? 350;

    const useItemSelector: GenericDashboardDataGridProps<DateAndLA>["useItemSelector"] =
        React.useCallback(
            () => (state: RootState) => {
                const parseLa = (date: string) =>
                    parse(date, "yyyy-MM-dd", new Date());

                const las = limitedAvailabilitySelectors
                    .selectAll(state)
                    .filter(
                        (la) =>
                            compareAsc(start, parseLa(la.date)) !== 1 &&
                            compareAsc(parseLa(la.date), end) !== 1 &&
                            la.employee === employeeId
                    );

                const daysToLas = new Map<number, LimitedAvailability>();
                for (const la of las) {
                    daysToLas.set(parseLa(la.date).getTime(), la);
                }

                const days = eachDayOfInterval({ start, end });

                const result: DateAndLA[] = days.map((day) => ({
                    id: day.getTime(),
                    date: day,
                    la: daysToLas.get(day.getTime()) ?? null,
                }));

                return result;
            },
            [employeeId, start, end]
        );

    const useColumnDefs = React.useCallback(() => {
        const signalAdd: CallbackTypes.EMPLOYEE_AVAILABILITY_ADD = useSignal(
            EventTypes.EMPLOYEE_AVAILABILITY_ADD
        );

        const signalUpdate: CallbackTypes.EMPLOYEE_AVAILABILITY_UPDATE =
            useSignal(EventTypes.EMPLOYEE_AVAILABILITY_UPDATE);

        return React.useMemo(
            () => [
                {
                    field: "date",
                    headerName: "Day",
                    type: "date",
                    flex: 1,
                },
                {
                    field: "la",
                    headerName: "Availability",
                    valueFormatter: (params: GridValueFormatterParams) => {
                        switch ((params.value as any)?.la_type) {
                            case LA_Type.FreeDay:
                                return "Free Day";
                            case LA_Type.Preference:
                                return "Preference";
                        }

                        return "--";
                    },
                    flex: 5,
                },
                {
                    field: "actions",
                    type: "actions",
                    getActions: (params: GridRowParams<DateAndLA>) => [
                        params.row.la ? (
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    signalUpdate({
                                        employeeAvailabilityId:
                                            params.row.la.id,
                                    })
                                }
                            >
                                <EditIcon />
                            </IconButton>
                        ) : (
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    signalAdd({
                                        date: params.row.date,
                                        employeeId,
                                    })
                                }
                            >
                                <AddIcon />
                            </IconButton>
                        ),
                    ],
                },
            ],
            [signalAdd, signalUpdate, employeeId]
        );
    }, []);

    return (
        <EventProvider events={Object.values(EventTypes)}>
            {/*<GenericAddDialog {...addEmployeeDialogProps} />*/}
            <CreateEmployeeAvailabilityDialog />
            <GenericUpdateDialog {...updateEmployeeDialogProps} />
            <Box sx={{ height }}>
                <GenericDashboardDataGrid
                    useItemSelector={useItemSelector}
                    useColumnDefs={useColumnDefs}
                />
            </Box>
        </EventProvider>
    );
};

export default EmployeeAvailabilityWidget;

/**
 *
 */

interface DateAndLA {
    id: number;
    date: Date;
    la: LimitedAvailability;
}

/**
 * Dialogs
 */

interface Inputs {
    la_type: LA_Type;
    shift_templates: number[];
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "choose_object",
        name: "la_type",
        label: "Type",
        validation: yup.string().required(),

        entitySelector: () => [LA_Type.FreeDay, LA_Type.Preference],
        entityToString: (la_type: LA_Type) => {
            switch (la_type) {
                case LA_Type.FreeDay:
                    return "Free Day";
                case LA_Type.Preference:
                    return "No Full Day";
            }

            return "";
        },
        entityGetId: (la: LA_Type) => la,
    } as ChooseObjectIdFieldData<Inputs, LA_Type>,
    {
        type: "choose_object",
        name: "shift_templates",
        label: "Shift templates",
        validation: yup.array().of(yup.number().required()),

        entitySelector: shiftTemplateSelectors.selectAll,
        entityToString: (st: ShiftTemplate) =>
            `${st.time_from} -- ${st.time_to}`,

        multiple: true,
    } as ChooseObjectIdFieldData<Inputs, ShiftTemplate>,
];

const updateEmployeeDialogProps: GenericUpdateDialogProps<
    CallbackTypes.EMPLOYEE_AVAILABILITY_UPDATE_ARG_TYPE,
    LimitedAvailability,
    Inputs
> = {
    getItemId: (arg) => arg.employeeAvailabilityId,
    itemSelector: (itemId) => (state) =>
        //shiftTemplateSelectors.selectById(state, itemId),
        limitedAvailabilitySelectors.selectById(state, itemId),
    eventType: EventTypes.EMPLOYEE_AVAILABILITY_UPDATE,
    title: "Update Availability",
    formId: "EMPLOYEE_AVAILABILITY_UPDATE_FORM",
    fields,
    getDefaultValues: ({ la_type, shift_templates }: LimitedAvailability) => ({
        //time_from: parse(time_from, "HH:mm:ss", new Date()),
        //ime_to: parse(time_to, "HH:mm:ss", new Date()),
        la_type,
        shift_templates,
    }),
    submit:
        (dispatch, item, token) =>
        async ({ la_type, shift_templates }) => {
            const res = await axios.put<LimitedAvailability>(
                `${MANAGER_API_ROUTES.limitedAvailability}${item.id}/`,
                {
                    //time_from: format(time_from, "HH:mm"),
                    //time_to: format(time_to, "HH:mm"),
                    //workplace: item.workplace,
                    employee: item.employee,
                    date: item.date,
                    la_type,
                    shift_templates,
                },
                getTokenRequestConfig(token)
            );

            const { id, ...rest } = res.data;
            dispatch(
                limitedAvailabilityActions.updateOne({ id, changes: rest })
            );
            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully updated an avaialbility: ${id}`,
                })
            );
        },
    onDelete: async (dispatch, laId, token) => {
        await axios.delete(
            `${MANAGER_API_ROUTES.limitedAvailability}${laId}/`,
            getTokenRequestConfig(token)
        );

        dispatch(limitedAvailabilityActions.removeOne(laId));
        dispatch(
            addAlert({
                type: "info",
                message: `Removed an availability: ${laId}`,
            })
        );
    },
};
