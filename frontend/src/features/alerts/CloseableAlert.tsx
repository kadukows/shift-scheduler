import * as React from "react";
import { useDispatch } from "react-redux";
import { Collapse } from "@mui/material";
import { Alert as AlertMui, Snackbar } from "@mui/material";

import { Alert, removeAlert } from "./alertsSlice";

interface Props {
    alert: Alert;
}

const CloseableAlert = ({ alert }: Props) => {
    const [open, setOpen] = React.useState(true);
    const dispatch = useDispatch();

    const handleClose = (
        event: React.SyntheticEvent | React.MouseEvent,
        reason?: string
    ) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const handleExited = () => {
        dispatch(removeAlert(alert.id));
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
        >
            <AlertMui
                onClose={handleClose}
                severity={alert.type}
                sx={{ width: "100%" }}
                elevation={6}
                variant="filled"
            >
                {alert.message}
            </AlertMui>
        </Snackbar>
    );
};

export default CloseableAlert;

/**
 * <Collapse in={on} onExited={() => dispatch(removeAlert(alert.id))}>
 */
