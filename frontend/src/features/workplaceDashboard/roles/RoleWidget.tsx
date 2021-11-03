import * as React from "react";
import { Typography, Paper, Stack } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import RoleDataGrid from "./RoleDataGrid";
import EventProvider from "../../eventProvider/EventProvider";
import { EventTypes } from "./EventTypes";
import { UpdateRoleDialog } from "./RoleDialog";

interface Props {}

const RoleWidget = (props: Props) => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <UpdateRoleDialog />
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <Typography variant="h4" component="h4">
                        Roles <PersonIcon />
                    </Typography>
                    <RoleDataGrid />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default RoleWidget;
