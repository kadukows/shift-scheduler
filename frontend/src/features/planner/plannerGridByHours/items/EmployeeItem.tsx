import * as React from "react";
import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../../store";
import { roleSelectors } from "../../../roles/rolesSlice";
import { Shift } from "../../../shifts/shiftSlice";
import { StyledDiv } from "./StyledDiv";

interface Props {
    shift: Shift;
}

const EmployeeItem = ({ shift }: Props) => {
    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    return (
        <StyledDiv>
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
