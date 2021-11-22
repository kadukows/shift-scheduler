import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Stack,
    Typography,
    Button,
} from "@mui/material";
import { FieldData } from "../genericForm/fieldInstance/Field";
import GenericForm from "../genericForm/GenericForm";
import { GENERAL_API_ROUTES } from "../../ApiRoutes";
import { useDispatch } from "react-redux";
import { tryAuthWithToken } from "../auth/authSlice";
import { addAlert } from "../alerts/alertsSlice";

interface Props {
    open: boolean;
    setOpen: (b: boolean) => void;
}

const LoginRegisterDialog = ({ open, setOpen }: Props) => {
    const [mode, setMode] = React.useState(Mode.Login);
    const handleClose = React.useCallback(() => setOpen(false), [setOpen]);
    const handleLoginClick = React.useCallback(
        () => setMode(Mode.Login),
        [setMode]
    );
    const handleRegisterClick = React.useCallback(
        () => setMode(Mode.Register),
        [setMode]
    );
    const dispatch = useDispatch();
    const loginSubmit = React.useCallback(
        async ({ username, password }: LoginInputs) => {
            const res = await axios.post<{ token: string }>(
                GENERAL_API_ROUTES.getToken,
                {
                    username,
                    password,
                }
            );

            dispatch(tryAuthWithToken(res.data.token));
            dispatch(
                addAlert({
                    type: "info",
                    message: "Successfully logged in!",
                })
            );
            setOpen(false);
        },
        [dispatch, setOpen]
    );
    const registerSubmit = React.useCallback(
        async ({ username, password }: RegisterInputs) => {
            await axios.post(GENERAL_API_ROUTES.user, { username, password });

            dispatch(
                addAlert({
                    type: "info",
                    message: "Successfully registered! You can now log in",
                })
            );
            setOpen(false);
        },
        [dispatch, setOpen]
    );

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle sx={{ mb: 0 }}>
                <Stack>
                    <Typography component="h6" variant="h6" align="center">
                        Shift Scheduler
                    </Typography>
                    <Stack sx={{ mt: 1 }} direction="row">
                        <Button
                            color="primary"
                            disabled={mode === Mode.Login}
                            onClick={handleLoginClick}
                            sx={{ flex: 1 }}
                        >
                            Login
                        </Button>
                        <Button
                            sx={{ ml: 1, flex: 1 }}
                            color="primary"
                            disabled={mode === Mode.Register}
                            onClick={handleRegisterClick}
                        >
                            Register
                        </Button>
                    </Stack>
                </Stack>
            </DialogTitle>
            <DialogContent>
                {mode === Mode.Login ? (
                    <GenericForm
                        fields={loginFields}
                        submit={loginSubmit}
                        formId="NAVBAR_LOGIN_FORM"
                    />
                ) : (
                    <GenericForm
                        fields={registerFields}
                        submit={registerSubmit}
                        formId="NAVBAR_REGISTER_FORM"
                    />
                )}
            </DialogContent>
            <DialogActions>
                {mode === Mode.Login ? (
                    <Button
                        type="submit"
                        form="NAVBAR_LOGIN_FORM"
                        color="primary"
                    >
                        Login
                    </Button>
                ) : (
                    <Button
                        type="submit"
                        form="NAVBAR_REGISTER_FORM"
                        color="primary"
                    >
                        Register
                    </Button>
                )}
                <Button onClick={handleClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginRegisterDialog;

enum Mode {
    Login = "Login",
    Register = "Register",
}

interface LoginInputs {
    username: string;
    password: string;
}

const loginFields: FieldData<LoginInputs, any>[] = [
    {
        type: "string",
        name: "username",
        label: "Username",
        validation: yup.string().required().label("Username"),
        textFieldProps: {
            autoFocus: true,
        },
    },
    {
        type: "string",
        name: "password",
        label: "Password",
        validation: yup.string().required().label("Password"),
        textFieldProps: {
            type: "password",
        },
    },
];

interface RegisterInputs {
    username: string;
    password: string;
    password2: string;
}

const registerFields: FieldData<RegisterInputs, any>[] = [
    {
        type: "string",
        name: "username",
        label: "Username",
        validation: yup.string().required().label("Username"),
    },
    {
        type: "string",
        name: "password",
        label: "Password",
        validation: yup.string().required().label("Password"),
        textFieldProps: {
            type: "password",
        },
    },
    {
        type: "string",
        name: "password2",
        label: "Repeat password",
        validation: yup
            .string()
            .required()
            .oneOf([yup.ref("password")], "Passwords must match!")
            .label("Repeat password"),
        textFieldProps: {
            type: "password",
        },
    },
];
