import * as React from "react";
import { useRouteMatch } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../store";
import PlannerBoard from "./PlannerBoard";
import Loader from "../loader/Loader";
import { scheduleSelectors } from "../schedules/scheduleSlice";
import RedirectWithAlert from "../alerts/RedirectWithAlert";

import "./style.css";

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
