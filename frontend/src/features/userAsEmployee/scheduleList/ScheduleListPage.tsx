import * as React from "react";
import * as DateFns from "date-fns";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    Stack,
    Paper,
    Typography,
    styled,
    Button,
    Box,
    Divider,
} from "@mui/material";
import { RootState } from "../../../store";
import { Schedule, scheduleSelectors } from "../schedule/scheduleSlice";
import RedirectWithAlert from "../../alerts/RedirectWithAlert";
import { shiftSelectors } from "../shift/shiftSlice";
import { workplaceSelectors } from "../workplace/workplaceSlice";
import ScheduleTable from "./ScheduleTable";
import { connectWithLoader } from "../../loader/Loader";
import { EMPLOYEE_API_ROUTES } from "../../../ApiRoutes";
import { getTokenRequestConfig } from "../../helpers";

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

    const token = useSelector((state: RootState) => state.authReducer.token);
    const [inProgress, setInProgress] = React.useState(false);
    const downloadCallback = React.useCallback(async () => {
        if (inProgress) {
            return;
        }

        setInProgress(true);

        try {
            const res = await axios.get(
                EMPLOYEE_API_ROUTES.employeeScheduleGetICal(schedule.id),
                getTokenRequestConfig(token)
            );

            const blobUrl = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement("a");
            link.href = blobUrl;
            link.setAttribute("download", `schedule-${schedule.id}.ical`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (e) {
            console.log(e);
        } finally {
            setInProgress(false);
        }
    }, [inProgress, setInProgress, schedule.id, token]);

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
                <Typography component="h4" variant="h4" noWrap>
                    {workplace.name} | {schedule.month_year}
                </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
                <Stack>
                    <Stack direction="row" alignContent="center">
                        <Typography align="center" component="h6" variant="h6">
                            Schedule
                        </Typography>
                        <Box sx={{ flex: 1 }} />
                        <Button
                            onClick={downloadCallback}
                            variant="contained"
                            color="primary"
                            disabled={inProgress}
                        >
                            Get iCal
                        </Button>
                    </Stack>
                    <Divider sx={{ my: 2 }} />
                    <DataGridDiv>
                        <ScheduleTable
                            useGetShifts={useGetShifts}
                            start={DateFns.startOfMonth(parsed).getTime()}
                            end={DateFns.endOfMonth(parsed).getTime()}
                        />
                    </DataGridDiv>
                </Stack>
            </Paper>
        </Stack>
    );
};

const DataGridDiv = styled("div")(({ theme }) => ({
    width: "100%",
    height: 650,
    marginTop: theme.spacing(1),
}));
