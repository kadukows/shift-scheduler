import * as React from "react";

import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../../store";
import { Shift } from "../../../shifts/shiftSlice";
import { StyledDiv } from "./StyledDiv";
import { employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";

interface Props {
    shift: Shift;
}

const RoleItem = ({ shift }: Props) => {
    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    return (
        <StyledDiv>
            <Typography>
                {employeeToString(employee)}
                <br />
                {DateFns.format(Date.parse(shift.time_from), "HH:mm")}
                --
                {DateFns.format(Date.parse(shift.time_to), "HH:mm")}
            </Typography>
        </StyledDiv>
    );
};

export default RoleItem;
