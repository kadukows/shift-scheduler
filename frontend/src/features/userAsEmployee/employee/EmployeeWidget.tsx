import * as React from "react";
import { Paper, Stack, styled, Typography } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
    GenericDashboardDataGridProps,
    GenericDashboardDataGrid,
    WidgetTitle,
} from "../../workplaceDashboard/generics";
import { Workplace, workplaceSelectors } from "../workplace/workplaceSlice";
import { Employee, employeeSelectors } from "./employeeSlice";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

const EmployeeWidget = () => {
    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
                <WidgetTitle>
                    Employments <BusinessIcon />
                </WidgetTitle>
                <DataGridDiv>
                    <GenericDashboardDataGrid {...dataGridProps} />
                </DataGridDiv>
            </Stack>
        </Paper>
    );
};

export default EmployeeWidget;

/**
 *
 */

const dataGridProps: GenericDashboardDataGridProps<Employee> = {
    useItemSelector: () => {
        return employeeSelectors.selectAll;
    },
    useColumnDefs: () => {
        const workplaceById = useSelector(workplaceSelectors.selectEntities);

        return React.useMemo(
            () =>
                [
                    {
                        field: "id",
                        headerName: "#",
                        type: "number",
                    },
                    {
                        field: "employee",
                        headerName: "Employee",
                        valueGetter: getFullName,
                        flex: 1,
                    },
                    {
                        field: "workplace",
                        headerName: "Workplace",
                        valueGetter: (params: GridRowParams<Employee>) =>
                            workplaceById[params.row.workplace]?.name,
                        flex: 1,
                    },
                ] as GridColDef[],
            [workplaceById]
        );
    },
};

const getFullName = (params: GridRowParams<Employee>) =>
    `${params.row.first_name} ${params.row.last_name}`;

const DataGridDiv = styled("div")({
    width: "100%",
    height: 300,
});
