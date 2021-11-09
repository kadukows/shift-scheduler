import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Grid } from "@mui/material";
import { RootState } from "../../store";
import RedirectWithAlert from "../alerts/RedirectWithAlert";
import WorkplaceLoader from "./WorkplaceLoader";
import WorkplaceProvider from "../workplaces/WorkplaceProvider";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import RoleWidget from "./roles";
import EmployeeWidget from "./employees";
import ScheduleWidget from "./schedules";
import WorkplaceBanner from "./workplaceBanner";

const WorkplaceDashboardPage = () => (
    <WorkplaceLoader>
        <WorkplaceDashboardPageImpl />
    </WorkplaceLoader>
);

export default WorkplaceDashboardPage;

/**
 *
 */

interface Params {
    workplaceId: string;
}

const WorkplaceDashboardPageImpl = () => {
    const workplaceId = parseInt(useParams<Params>().workplaceId);
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, workplaceId)
    );

    if (!workplace) {
        return (
            <RedirectWithAlert
                to="/"
                alert={{
                    type: "warning",
                    message: `Workplace with id "${workplaceId}" not found`,
                }}
            />
        );
    }

    return (
        <WorkplaceProvider workplaceId={workplaceId}>
            <Grid container spacing={2}>
                <Grid item sm={12}>
                    <WorkplaceBanner />
                </Grid>
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
        </WorkplaceProvider>
    );
};
