import * as React from "react";

import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../../store";
import { Shift, shiftSelectors } from "../../../shifts/shiftSlice";
import { HoverableDiv, StyledDiv } from "./StyledDiv";
import { employeeSelectors } from "../../../employees/employeeSlice";
import { employeeToString } from "../../../employees/helpers";
import { Role, roleSelectors } from "../../../roles/rolesSlice";
import { CallbackTypes, EventTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { useSignal } from "../../../eventProvider/EventProvider";

interface Props {
    shiftId: number;
}

const RoleItem = ({ shiftId }: Props) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const signal: CallbackTypes.EMPLOYEE_ITEM_CLICK = useSignal(
        EventTypes.ROLE_ITEM_CLICK
    );

    const gridArea = useGridArea<Date, Role>({
        xStart: new Date(shift.time_from),
        xEnd: new Date(shift.time_to),
        yStart: role,
    });

    return (
        <HoverableDiv sx={{ p: 0.7 }} style={{ gridArea }}>
            <StyledDiv onClick={() => signal(shift)}>
                <Typography>
                    {employeeToString(employee)}
                    <br />
                    {DateFns.format(Date.parse(shift.time_from), "HH:mm")}
                    --
                    {DateFns.format(Date.parse(shift.time_to), "HH:mm")}
                </Typography>
            </StyledDiv>
        </HoverableDiv>
    );
};

export default RoleItem;
