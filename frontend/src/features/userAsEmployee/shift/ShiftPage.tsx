import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../../store";
import RedirectWithAlert from "../../alerts/RedirectWithAlert";
import Loader from "../../loader/Loader";
import { scheduleSelectors } from "../schedule/scheduleSlice";
import ShiftWidget from "./ShiftWidget";

const ShiftPage = () => {
    return (
        <Loader useSlice={useSlice} precondition={pred}>
            <ShiftPageImpl />
        </Loader>
    );
};

export default ShiftPage;

/**
 *
 */

const useSlice = () =>
    useSelector(
        (state: RootState) =>
            state.employee_shiftReducer.loaded &&
            state.employee_scheduleReducer.loaded &&
            state.employee_roleReducer.loaded &&
            state.employee_workplaceReducer.loaded &&
            state.employee_employeeReducer.loaded
    );

const pred = (b: boolean) => b;

interface Params {
    schedule_id: string;
}

const ShiftPageImpl = () => {
    const scheduleId = parseInt(useParams<Params>().schedule_id);
    const schedule = useSelector((state: RootState) =>
        scheduleSelectors.selectById(state, scheduleId)
    );

    if (!schedule) {
        return (
            <RedirectWithAlert
                to="/as_employee/dashboard"
                alert={{
                    type: "info",
                    message: `Schedule with id ${scheduleId} does not exists`,
                }}
            />
        );
    }

    return <ShiftWidget scheduleId={scheduleId} />;
};
