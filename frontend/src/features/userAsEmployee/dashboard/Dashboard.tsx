import * as React from "react";
import { Box, Grid, Stack } from "@mui/material";
import ScheduleWidget from "../schedule/ScheduleWidget";
import EmployeeWidget from "../employee/EmployeeWidget";
import PassportCard from "../passport/PassportCard";

const Dashboard = () => {
    return (
        <Grid container spacing={2}>
            <Grid item sm={12} md={6}>
                <Stack spacing={2}>
                    <PassportCard />
                    <EmployeeWidget />
                </Stack>
            </Grid>
            <Grid item sm={12} md={6}>
                <ScheduleWidget />
            </Grid>
        </Grid>
    );
};

export default Dashboard;
