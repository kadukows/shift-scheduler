import * as React from "react";
import axios from "axios";
import * as yup from "yup";
import {
    Paper,
    Stack,
    styled,
    Typography,
    Box,
    Button,
    IconButton,
} from "@mui/material";
import {
    Business as BusinessIcon,
    Backspace as BackspaceIcon,
} from "@mui/icons-material";
import { useSelector, batch } from "react-redux";
import {
    GenericDashboardDataGridProps,
    GenericDashboardDataGrid,
    WidgetTitle,
} from "../../workplaceDashboard/generics";
import {
    getWorkplaces,
    Workplace,
    workplaceSelectors,
} from "../workplace/workplaceSlice";
import { Employee, employeeSelectors, employeeActions } from "./employeeSlice";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericAddButton,
    GenericAddDialog,
    GenericAddDialogProps,
} from "../../workplaceDashboard/generics";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { getTokenRequestConfig } from "../../helpers";
import { getSchedules } from "../schedule/scheduleSlice";
import { getShifts } from "../shift/shiftSlice";
import { getRoles } from "../role/roleSlice";
import { addAlert } from "../../alerts/alertsSlice";
import { refreshEmployeeData } from "../helpers";
import DeleteEmploymentDialog from "./DeleteEmploymentDialog";

const EmployeeWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...dialogProps} />
            <DeleteEmploymentDialog />
            <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <WidgetTitle>
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
                            <Box>
                                <Typography component="h6" variant="h6" noWrap>
                                    Employments <BusinessIcon />
                                </Typography>
                            </Box>
                            <Box sx={{ flex: 1 }} />
                            <GenericAddButton
                                addEvent={EventTypes.ADD_NEW_EMPLOYMENT}
                                text="Bind"
                            />
                        </Box>
                    </WidgetTitle>
                    <DataGridDiv>
                        <GenericDashboardDataGrid {...dataGridProps} />
                    </DataGridDiv>
                </Stack>
            </Paper>
        </EventProvider>
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
        const signal: CallbackTypes.DELETE_EMPLOYMENT = useSignal(
            EventTypes.DELETE_EMPLOYMENT
        );

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
                    {
                        field: "actions",
                        type: "actions",
                        width: 40,
                        getActions: (params: GridRowParams<Employee>) => [
                            <IconButton
                                color="primary"
                                onClick={() =>
                                    signal({ employeeId: params.row.id })
                                }
                            >
                                <BackspaceIcon />
                            </IconButton>,
                        ],
                    },
                ] as GridColDef[],
            [workplaceById, signal]
        );
    },
};

const getFullName = (params: GridRowParams<Employee>) =>
    `${params.row.first_name} ${params.row.last_name}`;

const DataGridDiv = styled("div")({
    width: "100%",
    height: 300,
});

interface Inputs {
    bind_key: string;
}

const dialogProps: GenericAddDialogProps<Inputs> = {
    useSubmit:
        () =>
        (dispatch, token) =>
        async ({ bind_key }) => {
            const res = await axios.post<Employee>(
                EMPLOYEE_API_ROUTES.employeeBindNewEmployee,
                {
                    bind_key,
                },
                getTokenRequestConfig(token)
            );

            batch(() => {
                dispatch(employeeActions.addOne(res.data));
                dispatch(
                    addAlert({
                        type: "info",
                        message: "Successfully bound to a new employee!",
                    })
                );
            });

            refreshEmployeeData(dispatch);
        },
    addEvent: EventTypes.ADD_NEW_EMPLOYMENT,
    formId: "EMPLOYEE_EMPLOYEE_WIDGET_ADD_NEW_EMPLOYMENT",
    title: "Add new employment",
    fields: [
        {
            type: "string",
            name: "bind_key",
            label: "Bind key",
            validation: yup.string().required().length(24).label("Bind key"),
        },
    ],
    submitButtonText: "Add",
};
