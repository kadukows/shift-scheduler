import * as React from "react";
import * as DateFns from "date-fns";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Stack, Paper, Typography, Divider } from "@mui/material";
import { RootState } from "../../../store";
import { Schedule, scheduleSelectors } from "../schedule/scheduleSlice";
import RedirectWithAlert from "../../alerts/RedirectWithAlert";
import { shiftSelectors } from "../shift/shiftSlice";
import { workplaceSelectors } from "../workplace/workplaceSlice";
import ScheduleTable from "./ScheduleTable";
import { connectWithLoader } from "../../loader/Loader";

const ScheduleListPage = () => {
    const scheduleId = parseInt(useParams<Params>().scheduleId);
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, scheduleId)
    );

    if (!schedule) {
        return (
            <RedirectWithAlert
                to="/"
                alert={{
                    type: "warning",
                    message: `Schedule with id ${scheduleId} not found`,
                }}
            />
        );
    }

    return <ScheduleListPageImpl schedule={schedule} />;
};

const useSlice = () =>
    useSelector(
        (state: RootState) =>
            state.employee_shiftReducer.loaded &&
            state.employee_scheduleReducer.loaded &&
            state.employee_roleReducer.loaded &&
            state.employee_workplaceReducer.loaded &&
            state.employee_employeeReducer.loaded
    );

export default connectWithLoader<{}>(useSlice)(ScheduleListPage);

/**
 *
 */

interface Params {
    scheduleId: string;
}

interface ImplProps {
    schedule: Schedule;
}

const ScheduleListPageImpl = ({ schedule }: ImplProps) => {
    const useGetShifts = React.useCallback(() => {
        return useSelector(shiftSelectors.selectAll).filter(
            (shift) => shift.schedule === schedule.id
        );
    }, [schedule.id]);

    const parsed = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, schedule.workplace)
    );

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
                <Typography component="h4" variant="h4" noWrap>
                    {workplace.name} | {schedule.month_year}
                </Typography>
            </Paper>
            <ScheduleTable
                useGetShifts={useGetShifts}
                start={DateFns.startOfMonth(parsed).getTime()}
                end={DateFns.endOfMonth(parsed).getTime()}
            />
        </Stack>
    );
};
