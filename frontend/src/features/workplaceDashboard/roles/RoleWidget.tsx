import * as React from "react";
import { Typography, Paper, Stack, Button } from "@mui/material";
import { Person as PersonIcon, Edit as EditIcon } from "@mui/icons-material";
import EventProvider from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
import { UpdateRoleDialog, AddRoleDialog } from "./RoleDialog";
import { GenericDashboardDataGrid, GenericAddButton } from "../generics";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";

interface Props {}

const RoleWidget = (props: Props) => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <AddRoleDialog />
            <UpdateRoleDialog />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="h4" component="h4">
                            Roles <PersonIcon />
                        </Typography>
                        <div style={{ flex: 1 }} />
                        <GenericAddButton addEvent={EventTypes.ROLE_ADD} />
                    </div>

                    <GenericDashboardDataGrid
                        itemSelector={(workplaceId) => (state) =>
                            rolesByWorkplaceSelector(state, workplaceId)}
                        updateEvent={EventTypes.ROLE_UPDATE}
                        makeColumnDefs={(signal: CallbackTypes.ROLE_UPDATE) => [
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
                                getActions: (params: GridRowParams<Role>) => [
                                    <GridActionsCellItem
                                        icon={<EditIcon />}
                                        label="Edit"
                                        onClick={() =>
                                            signal({ roleId: params.row.id })
                                        }
                                    />,
                                ],
                            },
                        ]}
                        DivProps={{
                            style: {
                                height: 350,
                                width: "100%",
                            },
                        }}
                    />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default RoleWidget;

/**
 *
 */

const rolesByWorkplaceSelector = createSelector(
    [
        (state: RootState) => roleSelectors.selectAll(state),
        (state: RootState, workplaceId: number) => workplaceId,
    ],
    (roles, workplaceId) =>
        roles.filter((role) => role.workplace === workplaceId)
);
