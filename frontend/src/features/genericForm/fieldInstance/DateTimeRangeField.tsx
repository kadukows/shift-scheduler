import * as React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { DateRangePicker, DateRange } from "@mui/lab";
import { Control, useController } from "react-hook-form";

interface Props<Inputs> {
    field: DateTimeRangeFieldData<Inputs>;
    control: Control<Inputs>;
}

const DateTimeRangeField = <Inputs extends unknown>({
    field,
    control,
}: Props<Inputs>) => {
    const {
        field: { ref, value, ...inputProps },
        fieldState: { invalid, error },
    } = useController({
        name: field.name as any,
        control,
    });

    const valueSafe: any = value ?? [null, null];

    return (
        <DateRangePicker
            startText={field.startText}
            endText={field.endText}
            ref={ref}
            value={valueSafe as DateRange<Date>}
            {...inputProps}
            renderInput={(startProps, endProps) => (
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "spaceAround",
                        alignContent: "center",
                    }}
                >
                    <TextField {...startProps} error={invalid} />
                    <Typography alignContent="center" sx={{ mx: 2 }}>
                        {" "}
                        to{" "}
                    </Typography>
                    <TextField
                        {...endProps}
                        error={invalid}
                        helperText={error?.message}
                    />
                </Box>
            )}
        />
    );
};

export default DateTimeRangeField;

/**
 *
 */

export interface DateTimeRangeFieldData<Inputs> {
    type: "datetime_range";
    name: keyof Inputs;
    startText?: string;
    endText?: string;
}
