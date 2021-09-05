import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { AlertWithId, removeAlert } from "./alertsSlice";
import { makeStyles, Collapse } from "@material-ui/core";
import { Alert as AlertMui } from "@material-ui/lab";

import CloseableAlert from "./CloseableAlert";

const AlertsList = () => {
    const alerts = useSelector(
        (state: RootState) => state.alertsReducer.alerts
    );
    const dispatch = useDispatch();

    return (
        <div>
            {alerts.map((alert) => (
                <CloseableAlert
                    onExit={() => dispatch(removeAlert(alert.id))}
                    alert={alert}
                    key={alert.id}
                />
            ))}
        </div>
    );
};

export default AlertsList;
