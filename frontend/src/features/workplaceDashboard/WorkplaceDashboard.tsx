import * as React from "react";
import { Stack, Grid } from "@mui/material";
import RoleWidget from "./roles";

interface Props {}

const WorkplaceDashboard = (props: Props) => {
    return (
        <Grid container spacing={2}>
            <Grid item md={5} sm={12}>
                <RoleWidget />
            </Grid>
        </Grid>
    );
};

export default WorkplaceDashboard;
