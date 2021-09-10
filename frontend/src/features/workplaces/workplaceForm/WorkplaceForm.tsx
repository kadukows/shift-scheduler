import * as React from "react";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios, { AxiosError } from "axios";
import {
    makeStyles,
    Paper,
    Grid,
    TextField,
    Typography,
    Button,
} from "@material-ui/core";
import { Work as WorkIcon } from "@material-ui/icons";
import { useForm, SubmitHandler } from "react-hook-form";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../../store";
import { addAlert } from "../../alerts/alertsSlice";
import { Workplace, addWorkplace } from "../workplaceSlice";
import {
    getTokenRequestConfig,
    DjangoErrors,
    handleErrors,
    MyTextField,
} from "../../helpers";

interface Inputs {
    name: string;
}

interface Props {
    onSubmitted: (workplace: Workplace) => void;
    formId: string;
}

const schema = yup.object().shape({
    name: yup.string().required().min(4),
});

const useStyles = makeStyles((theme) => ({
    paper: {
        padding: theme.spacing(1),
    },
}));

const WorkplaceForm = ({ onSubmitted, formId }: Props) => {
    const classes = useStyles();
    const auth = useSelector((state: RootState) => state.authReducer);
    const dispatch = useDispatch();
    const history = useHistory();
    const [nonFieldErrors, setNonFieldErrors] = React.useState<Array<string>>(
        []
    );

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        setError,
    } = useForm<Inputs>({
        resolver: yupResolver(schema),
    });

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const res = await axios.post<Workplace>(
                "/api/workplace/",
                data,
                getTokenRequestConfig(auth.token)
            );

            dispatch(addWorkplace(res.data));
            onSubmitted(res.data);
        } catch (err: any | AxiosError<DjangoErrors<Inputs>>) {
            if (axios.isAxiosError(err)) {
                const error: AxiosError<DjangoErrors<Inputs>> = err;
                if (error.response?.data) {
                    handleErrors(
                        ["name"],
                        error.response,
                        setError,
                        setNonFieldErrors
                    );
                }
            }
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} id={formId}>
            <Grid container direction="column" spacing={2}>
                <Grid item>
                    <Typography variant="h5" component="h5">
                        Add a workplace <WorkIcon />
                    </Typography>
                </Grid>
                <Grid item>
                    <MyTextField
                        errors={errors}
                        name="name"
                        isSubmitting={isSubmitting}
                        register={register}
                    />
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        type="submit"
                        color="primary"
                        variant="contained"
                    >
                        Submit
                    </Button>
                </Grid>
            </Grid>
        </form>
    );
};

export default WorkplaceForm;
