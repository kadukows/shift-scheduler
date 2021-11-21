import * as React from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    Button,
    Typography,
    Stack,
    TextField,
    IconButton,
} from "@mui/material";
import { VpnKey as VpnKeyIcon } from "@mui/icons-material";
import { useSlot } from "../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "./EventTypes";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import {
    Employee,
    employeeSelectors,
    updateEmployee,
} from "../../employees/employeeSlice";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import { getTokenRequestConfig } from "../../helpers";

const KeyDialog = () => {
    const [employeeId, setEmployeeId] = React.useState<number | null>(null);
    const [open, setOpen] = React.useState(false);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);

    useSlot<CallbackTypes.EMPLOYEE_KEY_DIALOG_OPEN>(
        EventTypes.EMPLOYEE_KEY_DIALOG_OPEN,
        ({ employeeId }) => {
            setEmployeeId(employeeId);
            setOpen(true);
        },
        [setOpen, setEmployeeId]
    );

    const dispatch = useDispatch();

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, employeeId)
    );

    const token = useSelector((state: RootState) => state.authReducer.token);

    const generateNewCallback = React.useCallback(async () => {
        try {
            const res = await axios.post<Employee>(
                MANAGER_API_ROUTES.employeeGetBindingKey(employeeId),
                null,
                getTokenRequestConfig(token)
            );

            const { id, bounding_key } = res.data;

            dispatch(
                updateEmployee({
                    id,
                    changes: {
                        bounding_key,
                    },
                })
            );
        } catch (e) {
            console.log(e);
        }
    }, [token, dispatch, employeeId]);

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>Binding key</DialogTitle>
            <DialogContent>
                <Stack direction="row" spacing={1} sx={{ p: 2 }}>
                    <TextField
                        InputProps={{ readOnly: true }}
                        label="Binding Key"
                        value={employee?.bounding_key ?? ""}
                    />
                    <Button onClick={generateNewCallback} color="primary">
                        Generate new <VpnKeyIcon sx={{ ml: 1 }} />
                    </Button>
                </Stack>
            </DialogContent>
        </Dialog>
    );
};

export default KeyDialog;
