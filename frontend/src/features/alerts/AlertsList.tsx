import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store";
import { AlertWithId, removeAlert } from "./alertsSlice";
import { Collapse } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';
import { Alert as AlertMui } from '@mui/material';

import CloseableAlert from "./CloseableAlert";

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
