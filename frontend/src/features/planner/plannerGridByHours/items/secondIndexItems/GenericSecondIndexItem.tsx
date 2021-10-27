import * as React from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { RootState } from "../../../../../store";
import {
    Employee,
    employeeSelectors,
} from "../../../../employees/employeeSlice";
import { useGridAreaMemo } from "../../../../genericCssGrid/GenericCssGrid";
import { Role, roleSelectors } from "../../../../roles/rolesSlice";
import { shiftSelectors } from "../../../../shifts/shiftSlice";
import { set } from "../../updateDialogSlice";
import { HoverableDiv, StyledDiv } from "../StyledDiv";

interface Props<SecondIndex> {
    shiftId: number;
    getSecondIndex: (employee: Employee, role: Role) => SecondIndex;
    getNodeDesc: (employee: Employee, role: Role) => string;
}

const GenericSecondIndexItem = <SecondIndex extends { id: number }>({
    shiftId,
    getSecondIndex,
    getNodeDesc,
}: Props<SecondIndex>) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    const secondIndex = getSecondIndex(employee, role);

    const gridArea = useGridAreaMemo<Date, SecondIndex>(
        {
            xStart: new Date(shift.time_from),
            xEnd: new Date(shift.time_to),
            yStart: secondIndex,
        },
        [shiftId, secondIndex.id]
    );

    const dispatch = useDispatch();

    return (
        <HoverableDiv sx={{ p: 0.7 }} style={{ gridArea }}>
            <StyledDiv onClick={() => dispatch(set({ shiftId, open: true }))}>
                <Typography>
                    {getNodeDesc(employee, role)}
                    <br />
                    {format(Date.parse(shift.time_from), "HH:mm")}
                    --
                    {format(Date.parse(shift.time_to), "HH:mm")}
                </Typography>
            </StyledDiv>
        </HoverableDiv>
    );
};

export default GenericSecondIndexItem;
