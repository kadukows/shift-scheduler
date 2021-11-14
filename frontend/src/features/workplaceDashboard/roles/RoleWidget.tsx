import * as React from "react";
import {
    Typography,
    Paper,
    Stack,
    styled,
    Button,
    IconButton,
} from "@mui/material";
import { Person as PersonIcon, Edit as EditIcon } from "@mui/icons-material";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
import { UpdateRoleDialog, AddRoleDialog } from "./RoleDialog";
import { GenericDashboardDataGrid, GenericAddButton } from "../generics";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { useEffectWithoutFirst } from "../../helpers";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";

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
                        useItemSelector={useItemSelector}
                        useColumnDefs={useColumnDefs}
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

const useItemSelector = () => {
    const workplaceId = useWorkplaceId();
    return (state: RootState) => rolesByWorkplaceSelector(state, workplaceId);
};

const useColumnDefs = () => {
    const signal: CallbackTypes.ROLE_UPDATE = useSignal(EventTypes.ROLE_UPDATE);

    const memoMapRef = React.useRef<Map<number, () => void>>(new Map());
    // used only to force rerender
    const [bogus, setBogus] = React.useState(5544);

    useEffectWithoutFirst(() => {
        memoMapRef.current = new Map();
        setBogus(Math.random());
    }, [signal]);

    const memoizedSignal = React.useCallback(
        (roleId: number) => {
            if (memoMapRef.current.has(roleId)) {
                return memoMapRef.current.get(roleId);
            }

            const result = () => signal({ roleId });
            memoMapRef.current.set(roleId, result);
            return result;
        },
        [signal, memoMapRef.current]
    );

    return React.useMemo(
        () => [
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
                    <IconButton
                        component="span"
                        color="primary"
                        onClick={memoizedSignal(params.row.id)}
                    >
                        <EditIcon />
                    </IconButton>,
                ],
            },
        ],
        [memoizedSignal]
    );
};
