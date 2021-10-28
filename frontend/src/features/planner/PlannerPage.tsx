import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";
import * as DateFns from "date-fns";

import { RootState } from "../../store";
import PlannerBoard from "./PlannerBoard";
import { scheduleSelectors } from "../schedules/scheduleSlice";
import RedirectWithAlert from "../alerts/RedirectWithAlert";

interface Props {}

interface RouteMatch {
    schedule_id: string;
}

const PlannerPage = (props: Props) => {
    const schedule_id = parseInt(
        useRouteMatch<RouteMatch>().params.schedule_id
    );
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, schedule_id)
    );

    if (schedule)
        return schedule ? (
            <PlannerBoard schedule={schedule} />
        ) : (
            <RedirectWithAlert
                alert={{
                    type: "warning",
                    message: "Schedule not found",
                }}
                to="/"
            />
        );
};

export default PlannerPage;
