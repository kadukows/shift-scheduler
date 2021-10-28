import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";

import CloseableAlert from "./CloseableAlert";

/*
const AlertsList = () => {
    const alerts = useSelector(
        (state: RootState) => state.alertsReducer.alerts
    );
    const dispatch = useDispatch();

    return (
        <div>
            {alerts.map((alert) => (
                <CloseableAlert alert={alert} key={alert.id} />
            ))}
        </div>
    );
};

export default AlertsList;
*/
