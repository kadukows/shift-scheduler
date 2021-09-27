import * as React from "react";
import { useDispatch } from "react-redux";
import { Redirect } from "react-router-dom";

import { Alert, addAlert } from "./alertsSlice";

interface Props extends React.ComponentProps<typeof Redirect> {
    alert: Alert;
}

const RedirectWithAlert = ({ alert, ...rest }: Props) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(addAlert(alert));
    }, []);

    return <Redirect {...rest} />;
};

export default RedirectWithAlert;
