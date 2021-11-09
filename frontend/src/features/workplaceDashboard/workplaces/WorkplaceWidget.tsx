import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Stack,
    Paper,
    Typography,
    styled,
    IconButton,
    InputOwnerState,
} from "@mui/material";
import {
    Edit as EditIcon,
    List as ListIcon,
    Business as BusinessIcon,
} from "@mui/icons-material";
import EventProvider from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericAddButton,
    GenericAddDialog,
    GenericAddDialogProps,
    GenericDashboardDataGrid,
    GenericDashboardDataGridProps,
} from "../generics";
import {
    addWorkplace,
    Workplace,
    workplaceSelectors,
} from "../../workplaces/workplaceSlice";
import { GridRowParams } from "@mui/x-data-grid";
import { useHistory } from "react-router-dom";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { getTokenRequestConfig } from "../../helpers";
import { addAlert } from "../../alerts/alertsSlice";

const WorkplaceWidget = () => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <GenericAddDialog {...addWorkplaceDialogProps} />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Stack direction="row">
                        <Typography variant="h4" component="h4">
                            Workplaces <BusinessIcon />
                        </Typography>
                        <Spacer />
                        <GenericAddButton addEvent={EventTypes.ADD_WORKPLACE} />
                    </Stack>
                    <GenericDashboardDataGrid {...dataGridProps} />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default WorkplaceWidget;

/**
 *
 */

const Spacer = styled("div")({
    flex: 1,
});

const dataGridProps: GenericDashboardDataGridProps<Workplace> = {
    useItemSelector: () => {
        return workplaceSelectors.selectAll;
    },
    updateEvent: EventTypes.UPDATE_WORKPLACE,
    useColumnDefs: (signal: CallbackTypes.UPDATE_WORKPLACE) => {
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

                flex: 1,
            },
            {
                field: "actions",
                type: "actions",
                getActions: (params: GridRowParams<Workplace>) => [
                    <IconButton
                        color="primary"
                        onClick={() => signal({ workplaceId: params.row.id })}
                    >
                        <EditIcon />
                    </IconButton>,
                    <IconButton
                        color="primary"
                        onClick={() =>
                            history.push(`/workplaceDashboard/${params.row.id}`)
                        }
                    >
                        <ListIcon />
                    </IconButton>,
                ],
            },
        ];
    },
};

interface Inputs {
    name: string;
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "string",
        name: "name",
        label: "Name",
        validation: yup.string().required(),
    },
];

const addWorkplaceDialogProps: GenericAddDialogProps<Inputs> = {
    addEvent: EventTypes.ADD_WORKPLACE,
    title: "Add workplace",
    fields,
    useSubmit: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (dispatch, token) =>
                async ({ name }) => {
                    const res = await axios.post<Workplace>(
                        "/api/workplace/",
                        {
                            name,
                        },
                        getTokenRequestConfig(token)
                    );

                    dispatch(addWorkplace(res.data));
                    dispatch(
                        addAlert({
                            type: "info",
                            message: `Added a schedule: ${res.data.name}`,
                        })
                    );
                },
            [workplaceId]
        );
    },
};
