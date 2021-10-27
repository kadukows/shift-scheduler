import * as React from "react";
import { useDispatch } from "react-redux";
import { Collapse } from "@mui/material";
import { Alert as AlertMui } from "@mui/material";

import { AlertWithId, removeAlert } from "./alertsSlice";

interface Props {
    alert: AlertWithId;
}

const CloseableAlert = ({ alert }: Props) => {
    const [on, setOn] = React.useState(true);
    const dispatch = useDispatch();

    return (
        <Collapse in={on} onExited={() => dispatch(removeAlert(alert.id))}>
            <AlertMui severity={alert.type} onClose={() => setOn(false)}>
                {alert.message}
            </AlertMui>
        </Collapse>
    );
};

export default CloseableAlert;
