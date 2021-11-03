import * as React from "react";
import { Typography, Paper, Stack, Button } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import RoleDataGrid from "./RoleDataGrid";
import EventProvider, { useSignal } from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import { UpdateRoleDialog, AddRoleDialog } from "./RoleDialog";
import AddNewButton from "./AddNewButton";

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
                        <AddNewButton />
                    </div>

                    <RoleDataGrid />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default RoleWidget;
