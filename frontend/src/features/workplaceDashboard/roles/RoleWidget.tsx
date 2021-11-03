import * as React from "react";
import { Typography, Paper, Stack } from "@mui/material";
import { Person as PersonIcon } from "@mui/icons-material";
import RoleDataGrid from "./RoleDataGrid";

interface Props {}

const RoleWidget = (props: Props) => {
    return (
        <Paper sx={{ p: 2 }}>
            <Stack spacing={2}>
                <Typography variant="h4" component="h4">
                    Roles <PersonIcon />
                </Typography>
                <RoleDataGrid />
            </Stack>
        </Paper>
    );
};

export default RoleWidget;
