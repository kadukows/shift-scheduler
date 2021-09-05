import * as React from "react";
import { Collapse } from "@material-ui/core";
import { Alert as AlertMui } from "@material-ui/lab";

import { Alert } from "./alertsSlice";

interface Props {
    alert: Alert;
    onExit: () => void;
}

const CloseableAlert = ({ alert, onExit }: Props) => {
    const [on, setOn] = React.useState(true);

    return (
        <Collapse in={on} onExited={onExit}>
            <AlertMui severity={alert.type} onClose={() => setOn(false)}>
                {alert.message}
            </AlertMui>
        </Collapse>
    );
};

export default CloseableAlert;
