import * as React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { Alert, addAlert } from "./alertsSlice";

interface Props {
    alert: Alert;
    to: string;
}

const RedirectWithAlert = ({ alert, to }: Props) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(addAlert(alert));
    }, []);

    return <Redirect to={to} />;
};

export default RedirectWithAlert;
