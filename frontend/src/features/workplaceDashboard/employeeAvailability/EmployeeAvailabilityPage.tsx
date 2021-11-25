import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { startOfMonth, endOfMonth } from "date-fns";
import { Stack, Paper, Typography, TextField, Box } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { RootState } from "../../../store";
import RedirectWithAlert from "../../alerts/RedirectWithAlert";
import { employeeSelectors } from "../../employees/employeeSlice";
import { employeeToString } from "../../employees/helpers";
import { connectWithLoader } from "../../loader/Loader";
import EmployeeAvailabilityWidget from "./EmployeeAvailabilityWidget";

interface Props {}

interface Params {
    employeeId: string;
}

const EmployeeAvailabilityPage = (props: Props) => {
    const employeeId = parseInt(useParams<Params>().employeeId);

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, employeeId)
    );

    if (!employee) {
        return (
            <RedirectWithAlert
                to="/"
                alert={{
                    type: "info",
                    message: `Employee with id ${employeeId} not found`,
                }}
            />
        );
    }

    return <EmployeeAvailabilityPageImpl employeeId={employeeId} />;
};

const useLoaderSlice = () =>
    useSelector(
        (state: RootState) =>
            state.employeeReducer.loaded &&
            state.limitedAvailabilityReducer.loaded
    );

export default connectWithLoader<Props>(useLoaderSlice)(
    EmployeeAvailabilityPage
);

/**
 *
 */

interface ImplProps {
    employeeId: number;
}

const EmployeeAvailabilityPageImpl = React.memo(({ employeeId }: ImplProps) => {
    const [month, setMonth] = React.useState<Date | null>(new Date());

    const handleChange = React.useCallback(
        (value: Date | null) => {
            setMonth(value);
        },
        [setMonth]
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, employeeId)
    );

    return (
        <Stack spacing={2}>
            <Paper sx={{ p: 2 }}>
                <Typography component="h2" variant="h2">
                    Availability: {employeeToString(employee)}
                </Typography>
            </Paper>
            <Paper sx={{ p: 2 }}>
                <Stack spacing={2}>
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                        <Box sx={{ flex: 1 }} />
                        <DatePicker
                            label="Month"
                            inputFormat="MM.yyyy"
                            value={month}
                            onChange={handleChange}
                            renderInput={(params) => <TextField {...params} />}
                            views={["month", "year"]}
                        />
                    </Box>
                    <EmployeeAvailabilityWidget
                        employeeId={employeeId}
                        start={startOfMonth(month).getTime()}
                        end={endOfMonth(month).getTime()}
                        dataGridHeight={500}
                    />
                </Stack>
            </Paper>
        </Stack>
    );
});
