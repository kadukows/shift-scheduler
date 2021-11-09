import * as React from "react";
import { Typography, Paper } from "@mui/material";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { workplaceSelectors } from "../../workplaces/workplaceSlice";

const WorkplaceBanner = () => {
    const workplaceId = useWorkplaceId();
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, workplaceId)
    );

    return (
        <Paper sx={{ p: 4 }}>
            <Typography variant="h2" component="h2">
                {workplace.name}
            </Typography>{" "}
        </Paper>
    );
};

export default WorkplaceBanner;
