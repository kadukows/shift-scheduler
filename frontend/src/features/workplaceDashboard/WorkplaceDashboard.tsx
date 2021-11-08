import * as React from "react";
import { Stack, Grid } from "@mui/material";
import RoleWidget from "./roles";
import EmployeeWidget from "./employees";
import ScheduleWidget from "./schedules";

interface Props {}

const WorkplaceDashboard = (props: Props) => {
    return (
        <Grid container spacing={2}>
            <Grid item md={5} sm={12}>
                <RoleWidget />
            </Grid>
            <Grid item md={7} sm={12}>
                <EmployeeWidget />
            </Grid>
            <Grid item sm={12}>
                <ScheduleWidget />
            </Grid>
        </Grid>
    );
};

export default WorkplaceDashboard;
