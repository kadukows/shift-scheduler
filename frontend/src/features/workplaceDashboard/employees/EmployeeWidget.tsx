import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { Paper, Stack, IconButton, Box } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import {
    Work as WorkIcon,
    Edit as EditIcon,
    VpnKey as VpnKeyIcon,
    CalendarViewMonth as CalendarViewMonthIcon,
} from "@mui/icons-material";
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
    WidgetTitle,
} from "../generics";
import {
    addEmployee,
    Employee,
    employeeSelectors,
    removeEmployee,
    updateEmployee,
} from "../../employees/employeeSlice";
import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { getTokenRequestConfig } from "../../helpers";
import { addAlert } from "../../alerts/alertsSlice";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import KeyDialog from "./KeyDialog";
import { useHistory } from "react-router-dom";
import { ChooseObjectIdFieldData } from "../../genericForm/fieldInstance/ChooseObjectIdField";
import { roleSelectors, Role } from "../../roles/rolesSlice";

interface Props {
    dataGridHeight?: number;
}

const EmployeeWidget = ({ dataGridHeight }: Props) => {
    const height = dataGridHeight ?? 350;
    const workplaceId = useWorkplaceId();

    const fields: FieldData<Inputs, any>[] = [
        {
            type: "string",
            name: "first_name",
            label: "First Name",
            validation: yup.string().required(),
        },
        {
            type: "string",
            name: "last_name",
            label: "Last Name",
            validation: yup.string().required(),
        },
        {
            type: "choose_object",
            name: "possible_roles",
            label: "Possible roles",
            validation: yup.array().of(yup.number().required()),
            entitySelector: (state: RootState) =>
                roleSelectors
                    .selectAll(state)
                    .filter((r) => r.workplace === workplaceId),
            entityToString: (role) => role.name,
            multiple: true,
        } as ChooseObjectIdFieldData<Inputs, Role>,
    ];

    const addEmployeeDialogProps: GenericAddDialogProps<Inputs> = {
        addEvent: EventTypes.EMPLOYEE_ADD,
        title: "Add Employee",
        fields,
        formId: "ADD_EMPLOYEE_WORKPLACE_DASHBOARD_FORM",
        useSubmit: () => {
            const workplaceId = useWorkplaceId();

            return React.useCallback(
                (dispatch, token) =>
                    async ({ first_name, last_name, possible_roles }) => {
                        const res = await axios.post<Employee>(
                            MANAGER_API_ROUTES.employee,
                            {
                                first_name,
                                last_name,
                                workplace: workplaceId,
                                possible_roles,
                            },
                            getTokenRequestConfig(token)
                        );

                        dispatch(addEmployee(res.data));
                        dispatch(
                            addAlert({
                                type: "info",
                                message: "Added an Employee",
                            })
                        );
                    },
                [workplaceId]
            );
        },
    };

    const updateEmployeeDialogProps: GenericUpdateDialogProps<
        CallbackTypes.EMPLOYEE_UPDATE_ARG_TYPE,
        Employee,
        Inputs
    > = {
        getItemId: (arg) => arg.employeeId,
        itemSelector: (itemId) => (state) =>
            employeeSelectors.selectById(state, itemId),
        eventType: EventTypes.EMPLOYEE_UPDATE,
        title: "Update Employee",
        formId: "UPDATE_EMPLOYEE_WORKPLACE_DASHBOARD_FORM",
        fields,
        getDefaultValues: ({
            first_name,
            last_name,
            possible_roles,
        }: Employee) => ({
            first_name,
            last_name,
            possible_roles,
        }),
        submit:
            (dispatch, item, token) =>
            async ({ first_name, last_name, possible_roles }) => {
                const res = await axios.put<Employee>(
                    `${MANAGER_API_ROUTES.employee}${item.id}/`,
                    {
                        first_name,
                        last_name,
                        workplace: item.workplace,
                        possible_roles,
                    },
                    getTokenRequestConfig(token)
                );

                const { id, ...rest } = res.data;
                dispatch(updateEmployee({ id, changes: rest }));
                dispatch(
                    addAlert({
                        type: "info",
                        message: `Successfully updated an employee: ${id}`,
                    })
                );
            },
        onDelete: async (dispatch, employeeId, token) => {
            await axios.delete(
                `${MANAGER_API_ROUTES.employee}${employeeId}/`,
                getTokenRequestConfig(token)
            );

            dispatch(removeEmployee(employeeId));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Removed an employee: ${employeeId}`,
                })
            );
        },
    };

    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog
                {...addEmployeeDialogProps}
                defaultValues={{ possible_roles: [] }}
            />
            <GenericUpdateDialog {...updateEmployeeDialogProps} />
            <KeyDialog />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <WidgetTitle>
                            Employees <WorkIcon />
                        </WidgetTitle>
                        <Box sx={{ flex: 1 }} />
                        <GenericAddButton addEvent={EventTypes.EMPLOYEE_ADD} />
                    </Box>
                    <Box sx={{ height }}>
                        <GenericDashboardDataGrid {...dataGridProps} />
                    </Box>
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default EmployeeWidget;

/**
 *  DataGrid
 */

const getFullName = (params: any) =>
    `${params.row.first_name} ${params.row.last_name}`;

const dataGridProps: GenericDashboardDataGridProps<Employee> = {
    useItemSelector: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (state) =>
                employeeSelectors
                    .selectAll(state)
                    .filter((employee) => employee.workplace === workplaceId),
            [workplaceId]
        );
    },
    useColumnDefs: () => {
        const signalUpdate: CallbackTypes.EMPLOYEE_UPDATE = useSignal(
            EventTypes.EMPLOYEE_UPDATE
        );

        const signalKey: CallbackTypes.EMPLOYEE_KEY_DIALOG_OPEN = useSignal(
            EventTypes.EMPLOYEE_KEY_DIALOG_OPEN
        );

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
                flex: 5,
                valueGetter: getFullName,
                sortComparator: (v1, v2, cellParams1, cellParams2) =>
                    getFullName(cellParams1).localeCompare(
                        getFullName(cellParams2)
                    ),
            },
            {
                field: "bound_to",
                headerName: "Bound",
                flex: 1,
                type: "boolean",
            },
            {
                field: "actions",
                type: "actions",
                width: 150,
                getActions: (params: GridRowParams<Employee>) => [
                    <IconButton
                        color="primary"
                        onClick={() =>
                            signalUpdate({ employeeId: params.row.id })
                        }
                    >
                        <EditIcon />
                    </IconButton>,
                    <IconButton
                        color="primary"
                        onClick={() => signalKey({ employeeId: params.row.id })}
                    >
                        <VpnKeyIcon />
                    </IconButton>,
                    <IconButton
                        color="primary"
                        onClick={() =>
                            history.push(
                                `/employeeAvailability/${params.row.id}`
                            )
                        }
                    >
                        <CalendarViewMonthIcon />
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
    first_name: string;
    last_name: string;
    possible_roles: number[];
}
