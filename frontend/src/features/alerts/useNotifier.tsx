import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { RootState } from "../../store";
import { removeAlert, updateAlert } from "./alertsSlice";
import { Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

let displayed: string[] = [];

export const useNotifier = () => {
    const dispatch = useDispatch();
    const notifications = useSelector(
        (state: RootState) => state.alertsReducer.alerts
    );
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const storeDisplayed = (id: string) => {
        displayed.push(id);
    };

    const removeDisplayed = (id: string) => {
        displayed = displayed.filter((key) => key !== id);
    };

    React.useEffect(() => {
        for (const {
            id,
            message,
            type,
            options = {},
            dismissed = false,
        } of notifications) {
            if (dismissed) {
                closeSnackbar(id);
                continue;
            }

            if (displayed.includes(id)) {
                continue;
            }

            enqueueSnackbar(message, {
                key: id,
                ...options,
                variant: type,
                onClose: (event, reason, myKey) => {
                    if (options.onClose) {
                        options.onClose(event, reason, myKey);
                    }
                },
                onExited: (event, myKey) => {
                    dispatch(removeAlert(myKey as string));
                    removeDisplayed(myKey as string);
                },
                action: (key) => (
                    <Button
                        onClick={() =>
                            dispatch(
                                updateAlert({
                                    id: key,
                                    changes: { dismissed: true },
                                })
                            )
                        }
                    >
                        <CloseIcon />
                    </Button>
                ),
            });

            storeDisplayed(id);
        }
    }, [notifications, closeSnackbar, enqueueSnackbar, dispatch]);
};
