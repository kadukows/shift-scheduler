import * as React from "react";
import {
    Typography,
    Paper,
    Stack,
    styled,
    IconButton,
    Box,
} from "@mui/material";
import { Person as PersonIcon, Edit as EditIcon } from "@mui/icons-material";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
import { UpdateRoleDialog, AddRoleDialog } from "./RoleDialog";
import {
    GenericDashboardDataGrid,
    GenericAddButton,
    WidgetTitle,
} from "../generics";
import { GridActionsCellItem, GridRowParams } from "@mui/x-data-grid";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { useEffectWithoutFirst } from "../../helpers";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";

interface Props {
    dataGridHeight?: number;
}

const RoleWidget = ({ dataGridHeight }: Props) => {
    const height = dataGridHeight ?? 350;

    return (
        <EventProvider events={Object.values(EventTypes)}>
            <AddRoleDialog />
            <UpdateRoleDialog />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <WidgetTitle>
                            Roles <PersonIcon />
                        </WidgetTitle>
                        <Box sx={{ flex: 1 }} />
                        <GenericAddButton addEvent={EventTypes.ROLE_ADD} />
                    </Box>
                    <Box sx={{ height }}>
                        <GenericDashboardDataGrid
                            useItemSelector={useItemSelector}
                            useColumnDefs={useColumnDefs}
                        />
                    </Box>
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
    return React.useCallback(
        (state: RootState) =>
            roleSelectors
                .selectAll(state)
                .filter((role) => role.workplace === workplaceId),
        [workplaceId]
    );
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
                flex: 3,
            },
            {
                field: "priority",
                headerName: "Priority",
                flex: 1,
                type: "number",
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
