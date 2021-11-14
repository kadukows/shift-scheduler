import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { Typography, Paper, Stack, IconButton } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import { Work as WorkIcon, Edit as EditIcon } from "@mui/icons-material";
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

const EmployeeWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addEmployeeDialogProps} />
            <GenericUpdateDialog {...updateEmployeeDialogProps} />
            <></>
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="h4" component="h4">
                            Employees <WorkIcon />
                        </Typography>
                        <div style={{ flex: 1 }} />
                        <GenericAddButton addEvent={EventTypes.EMPLOYEE_ADD} />
                    </div>

                    <GenericDashboardDataGrid {...dataGridProps} />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default EmployeeWidget;

/**
 *  DataGrid
 */

const employeesByWorkplaceSelector = createSelector(
    [
        (state: RootState) => employeeSelectors.selectAll(state),
        (state: RootState, workplaceId: number) => workplaceId,
    ],
    (employees, workplaceId) =>
        employees.filter((employee) => employee.workplace === workplaceId)
);

const getFullName = (params: any) =>
    `${params.getValue(params.id, "first_name")} ${params.getValue(
        params.id,
        "last_name"
    )}`;

const dataGridProps: GenericDashboardDataGridProps<Employee> = {
    useItemSelector: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (state) => employeesByWorkplaceSelector(state, workplaceId),
            [workplaceId]
        );
    },
    useColumnDefs: () => {
        const signal: CallbackTypes.EMPLOYEE_UPDATE = useSignal(
            EventTypes.EMPLOYEE_UPDATE
        );
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
                valueGetter: getFullName,
                sortComparator: (v1, v2, cellParams1, cellParams2) =>
                    getFullName(cellParams1).localeCompare(
                        getFullName(cellParams2)
                    ),
            },
            {
                field: "actions",
                type: "actions",
                getActions: (params: GridRowParams<Employee>) => [
                    <IconButton
                        color="primary"
                        onClick={() => signal({ employeeId: params.row.id })}
                    >
                        <EditIcon />
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
}

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
                async ({ first_name, last_name }) => {
                    const res = await axios.post<Employee>(
                        MANAGER_API_ROUTES.employee,
                        {
                            first_name,
                            last_name,
                            workplace: workplaceId,
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
    getDefaultValues: ({ first_name, last_name }: Employee) => ({
        first_name,
        last_name,
    }),
    submit:
        (dispatch, item, token) =>
        async ({ first_name, last_name }) => {
            const res = await axios.put<Employee>(
                `${MANAGER_API_ROUTES.employee}${item.id}/`,
                {
                    first_name,
                    last_name,
                    workplace: item.workplace,
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
