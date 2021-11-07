import * as React from "react";
import { Typography, Paper, Stack, IconButton } from "@mui/material";
import { GridRowParams } from "@mui/x-data-grid";
import { Work as WorkIcon, Edit as EditIcon } from "@mui/icons-material";
import EventProvider from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericDashboardDataGrid,
    GenericDashboardDataGridProps,
} from "../generics";
import { Employee, employeeSelectors } from "../../employees/employeeSlice";
import { RootState } from "../../../store";
import { createSelector } from "@reduxjs/toolkit";

const EmployeeWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="h4" component="h4">
                            Employees <WorkIcon />
                        </Typography>
                        <div style={{ flex: 1 }} />
                    </div>

                    <GenericDashboardDataGrid {...dataGridProps} />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default EmployeeWidget;

/**
 *
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
    itemSelector: (workplaceId) => (state) =>
        employeesByWorkplaceSelector(state, workplaceId),
    updateEvent: EventTypes.EMPLOYEE_UPDATE,
    useColumnDefs: (signal) => [
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
    ],
};
