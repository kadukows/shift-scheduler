import * as React from "react";
import { Typography, Paper, Stack, Button } from "@mui/material";
import { Work as WorkIcon } from "@mui/icons-material";
import EmployeeDataGrid from "./EmployeeDataGrid";
import EventProvider from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";

interface Props {}

const EmployeeWidget = (props: Props) => {
    return (
        <EventProvider events={Object.values(EventTypes)}>
            <Paper sx={{ p: 4 }}>
                <Stack spacing={2}>
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        <Typography variant="h4" component="h4">
                            Employees <WorkIcon />
                        </Typography>
                        <div style={{ flex: 1 }} />
                    </div>

                    <EmployeeDataGrid />
                </Stack>
            </Paper>
        </EventProvider>
    );
};

export default EmployeeWidget;
