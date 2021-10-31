import * as React from "react";
import { Typography, Stack } from "@mui/material";
import { useSelector } from "react-redux";
import { format, compareAsc } from "date-fns";
import { RootState } from "../../../../../store";
import {
    Employee,
    employeeSelectors,
} from "../../../../employees/employeeSlice";
import { useGridAreaMemo } from "../../../../genericCssGrid/GenericCssGrid";
import { Role, roleSelectors } from "../../../../roles/rolesSlice";
import { shiftSelectors } from "../../../../shifts/shiftSlice";
import { SecondIndexItemDiv } from "../Divs";
import { createSelector } from "@reduxjs/toolkit";

interface BaseProps<SecondIndex> {
    getSecondIndex: (employee: Employee, role: Role) => SecondIndex;
    getNodeDesc: (employee: Employee, role: Role) => string;
}

interface Props<SecondIndex> extends BaseProps<SecondIndex> {
    shiftsId: number[];
}

const GenericSecondIndexItem = <SecondIndex extends Role | Employee>({
    shiftsId,
    getSecondIndex,
    getNodeDesc,
}: Props<SecondIndex>) => {
    const shifts = useSelector((state: RootState) =>
        selectByIds(state, shiftsId)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shifts[0].role)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shifts[0].employee)
    );

    const secondIndex = getSecondIndex(employee, role);

    const gridArea = useGridAreaMemo<Date, SecondIndex>(
        {
            xStart: new Date(shifts[0].time_from),
            yStart: secondIndex,
        },
        [shifts[0].time_from, secondIndex.id]
    );

    return (
        <Stack style={{ gridArea }} spacing="3px" direction="row">
            {shifts.map((shift) => (
                <GenericSecondIndexItemPartial
                    key={shift.id}
                    shiftId={shift.id}
                    getSecondIndex={getSecondIndex}
                    getNodeDesc={getNodeDesc}
                />
            ))}
        </Stack>
    );
};

export default GenericSecondIndexItem;

/**
 *
 */

interface GenericSecondIndexItemPartialProps<SecondIndex>
    extends BaseProps<SecondIndex> {
    shiftId: number;
}

const GenericSecondIndexItemPartial = <SecondIndex extends Role | Employee>({
    shiftId,
    getSecondIndex,
    getNodeDesc,
}: GenericSecondIndexItemPartialProps<SecondIndex>) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    return (
        <SecondIndexItemDiv>
            <Typography sx={{ p: 1 }} noWrap>
                {getNodeDesc(employee, role)}
                <br />
                {format(Date.parse(shift.time_from), "HH:mm")}
                --
                {format(Date.parse(shift.time_to), "HH:mm")}
            </Typography>
        </SecondIndexItemDiv>
    );
};

const selectByIds = createSelector(
    [
        (state: RootState) => state.shiftReducer.entities,
        (state: RootState, ids: number[]) => ids,
    ],
    (shiftsByIds, ids) =>
        ids
            .map((id) => shiftsByIds[id])
            .sort((lhs, rhs) =>
                compareAsc(Date.parse(lhs.time_from), Date.parse(rhs.time_from))
            )
);
