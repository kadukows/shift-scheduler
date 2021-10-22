import * as React from "react";
import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../../store";
import { roleSelectors } from "../../../roles/rolesSlice";
import { Shift } from "../../../shifts/shiftSlice";
import { StyledDiv } from "./StyledDiv";
import { useSignal } from "../../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "../EventTypes";

interface Props {
    shift: Shift;
}

const EmployeeItem = ({ shift }: Props) => {
    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const signal: CallbackTypes.EMPLOYEE_ITEM_CLICK = useSignal(
        EventTypes.EMPLOYEE_ITEM_CLICK
    );

    return (
        <StyledDiv onClick={() => signal(shift)}>
            <Typography>
                {role.name}
                <br />
                {DateFns.format(Date.parse(shift.time_from), "HH:mm")}
                --
                {DateFns.format(Date.parse(shift.time_to), "HH:mm")}
            </Typography>
        </StyledDiv>
    );
};

export default EmployeeItem;
