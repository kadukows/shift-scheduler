import * as React from "react";
import { Stack } from "@mui/material";
import RoleWidget from "./roles";

interface Props {}

const WorkplaceDashboard = (props: Props) => {
    return (
        <Stack spacing={3}>
            <RoleWidget />
        </Stack>
    );
};

export default WorkplaceDashboard;
