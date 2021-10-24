import * as React from "react";
import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import { useSelector } from "react-redux";

import { RootState } from "../../../../store";
import { roleSelectors } from "../../../roles/rolesSlice";
import { Shift, shiftSelectors } from "../../../shifts/shiftSlice";
import { HoverableDiv, StyledDiv } from "./StyledDiv";
import { useSignal } from "../../../eventProvider/EventProvider";
import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { Employee, employeeSelectors } from "../../../employees/employeeSlice";

interface Props {
    shiftId: number;
}

const EmployeeItem = ({ shiftId }: Props) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    const signal: CallbackTypes.EMPLOYEE_ITEM_CLICK = useSignal(
        EventTypes.EMPLOYEE_ITEM_CLICK
    );

    const gridArea = useGridArea<Date, Employee>({
        xStart: new Date(shift.time_from),
        xEnd: new Date(shift.time_to),
        yStart: employee,
    });

    return (
        <HoverableDiv sx={{ p: 0.7 }} style={{ gridArea }}>
            <StyledDiv onClick={() => signal(shift)}>
                <Typography>
                    {role.name}
                    <br />
                    {DateFns.format(Date.parse(shift.time_from), "HH:mm")}
                    --
                    {DateFns.format(Date.parse(shift.time_to), "HH:mm")}
                </Typography>
            </StyledDiv>
        </HoverableDiv>
    );
};

export default EmployeeItem;
