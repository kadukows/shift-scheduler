import * as React from "react";
import axios, { AxiosError } from "axios";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import {
    useForm,
    FormState,
    UseFormRegister,
    SubmitHandler,
} from "react-hook-form";
import { useHistory } from "react-router-dom";
import {
    TextField,
    Grid,
    Typography,
    Paper,
    Button,
    makeStyles,
    FormHelperText,
} from "@material-ui/core";
import { Lock } from "@material-ui/icons";
import { yupResolver } from "@hookform/resolvers/yup";

import { DjangoErrors, handleErrors } from "../helpers";
import { addAlert } from "../alerts/alertsSlice";
import { tryAuthWithToken } from "../auth/authSlice";

interface Props {}

interface Inputs {
    username: string;
    password: string;
}

interface MyFieldProps {
    errors: FormState<Inputs>["errors"];
    name: keyof Inputs;
    isSubmitting: boolean;
    register: UseFormRegister<Inputs>;
}

const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
});

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
    },
}));

const MyTextField = ({
    isSubmitting,
    register,
    name,
    errors,
    ...rest
}: Omit<React.ComponentProps<typeof TextField>, "variant"> & MyFieldProps) => {
    return (
        <TextField
            variant="outlined"
            error={!!errors[name]}
            helperText={errors[name]?.message}
            fullWidth
            disabled={isSubmitting}
            {...rest}
            {...register(name)}
        />
    );
};

const LoginForm = (props: Props) => {
    const [nonFieldErrors, setNonFieldErrors] = React.useState<Array<string>>(
        []
    );

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
        mode: "onBlur",
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await axios.post<{ token: string }>(
                "/api/get_token/",
                data,
                {
                    withCredentials: false,
                }
            );
            dispatch(
                addAlert({
                    type: "info",
                    message: "Successfully logged in!",
                })
            );
            dispatch(tryAuthWithToken(res.data.token));
            history.push("/");
        } catch (err: any | AxiosError<DjangoErrors<Inputs>>) {
            if (axios.isAxiosError(err)) {
                const error: AxiosError<DjangoErrors<Inputs>> = err;
                if (error.response?.data) {
                    handleErrors(
                        ["username", "password"],
                        error.response,
                        setError,
                        setNonFieldErrors
                    );
                }
            }
        }
    };

    const textFieldProps: Omit<MyFieldProps, "name"> = {
        errors,
        isSubmitting,
        register,
    };

    let i = 0;

    return (
        <Grid container justifyContent="center">
            <Grid item>
                <Paper className={classes.paper}>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Grid
                            container
                            direction="column"
                            spacing={2}
                            alignItems="center"
                        >
                            <Grid item>
                                <Typography variant="h5" component="h5">
                                    Log in! <Lock />
                                </Typography>
                            </Grid>

                            <Grid item>
                                <MyTextField
                                    name="username"
                                    label="Username"
                                    {...textFieldProps}
                                />
                            </Grid>
                            <Grid item>
                                <MyTextField
                                    name="password"
                                    label="Password"
                                    type="password"
                                    {...textFieldProps}
                                />
                            </Grid>
                            {nonFieldErrors &&
                                nonFieldErrors.map((msg) => (
                                    <FormHelperText key={i++} error>
                                        {msg}
                                    </FormHelperText>
                                ))}
                            <Grid item>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    type="submit"
                                >
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Grid>
        </Grid>
    );
};

export default LoginForm;