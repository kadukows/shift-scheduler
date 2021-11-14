import * as React from "react";
import { Paper, Stack, Typography, styled } from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { useSelector } from "react-redux";
import {
    GenericDashboardDataGridProps,
    GenericDashboardDataGrid,
} from "../../workplaceDashboard/generics";
import { Workplace, workplaceSelectors } from "../workplace/workplaceSlice";
import { Schedule, scheduleSelectors } from "./scheduleSlice";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

const ScheduleWidget = () => {
    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h3" component="h3">
                    Schedules
                </Typography>
                <DataGridDiv>
                    <GenericDashboardDataGrid {...dataGridProps} />
                </DataGridDiv>
            </Stack>
        </Paper>
    );
};

export default ScheduleWidget;

/**
 *
 */

const dataGridProps: GenericDashboardDataGridProps<Schedule> = {
    useItemSelector: () => {
        return scheduleSelectors.selectAll;
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
                        field: "month_year",
                        headerName: "Month",
                        flex: 1,
                    },
                    {
                        headerName: "Workplace",
                        valueGetter: (params: GridRowParams<Schedule>) =>
                            workplaceById[params.row.workplace].name,
                    },
                ] as GridColDef[],
            [workplaceById]
        );
    },
};

const DataGridDiv = styled("div")({
    width: "100%",
    height: 500,
});
