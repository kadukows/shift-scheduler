import * as React from "react";
import { Paper, Stack, Typography, styled, IconButton } from "@mui/material";
import {
    Business as BusinessIcon,
    MoreHoriz as MoreHorizIcon,
} from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
    GenericDashboardDataGridProps,
    GenericDashboardDataGrid,
    WidgetTitle,
} from "../../workplaceDashboard/generics";
import { Workplace, workplaceSelectors } from "../workplace/workplaceSlice";
import { Schedule, scheduleSelectors } from "./scheduleSlice";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";

const ScheduleWidget = () => {
    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
                <WidgetTitle>Schedules</WidgetTitle>
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
        const history = useHistory();

        return React.useMemo(
            () =>
                [
                    {
                        field: "id",
                        headerName: "#",
                        type: "number",
                        width: 40,
                    },
                    {
                        field: "month_year",
                        headerName: "Month",
                        flex: 1,
                    },
                    {
                        field: "workplace",
                        headerName: "Workplace",
                        valueGetter: (params: GridRowParams<Schedule>) =>
                            workplaceById[params.row.workplace]?.name,
                        flex: 2,
                    },
                    {
                        field: "actions",
                        type: "actions",
                        getActions: (params: GridRowParams<Schedule>) => [
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    history.push(
                                        `/as_employee/schedule/${params.row.id}`
                                    )
                                }
                            >
                                <MoreHorizIcon />
                            </IconButton>,
                        ],
                    },
                ] as GridColDef[],
            [workplaceById]
        );
    },
};

const DataGridDiv = styled("div")({
    width: "100%",
    height: 480,
});
