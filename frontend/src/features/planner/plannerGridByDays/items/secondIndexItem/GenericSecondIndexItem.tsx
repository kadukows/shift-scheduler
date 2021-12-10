import * as React from "react";
import { Typography, Stack, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
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
import { set as updateDialogSet } from "../../../dialogs/updateDialogSlice";
import { set as addDialogSet } from "../../../dialogs/addDialogSlice";

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
    const shiftsById = useSelector(shiftSelectors.selectEntities);
    const shifts = shiftsId
        .map((id) => shiftsById[id])
        .sort((a, b) =>
            compareAsc(Date.parse(a.time_from), Date.parse(b.time_from))
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
        <Box
            style={{
                gridArea,
                width: "100%",
                height: "100%",
            }}
        >
            <Box
                style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${shifts.length}, 1fr)`,
                    gap: "3px",
                    width: "100%",
                    height: "100%",
                }}
            >
                {shifts.map((shift) => (
                    <GenericSecondIndexItemPartial
                        key={shift.id}
                        shiftId={shift.id}
                        getSecondIndex={getSecondIndex}
                        getNodeDesc={getNodeDesc}
                    />
                ))}
            </Box>
        </Box>
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

    const dispatch = useDispatch();

    return (
        <SecondIndexItemDiv
            onClick={(e) => {
                if (e.altKey) {
                    dispatch(
                        addDialogSet({
                            open: true,
                            start: Date.parse(shift.time_from),
                            end: Date.parse(shift.time_to),
                            secondIndexItemId: getSecondIndex(employee, role)
                                .id,
                        })
                    );
                } else {
                    dispatch(
                        updateDialogSet({
                            open: true,
                            shiftId,
                        })
                    );
                }
            }}
        >
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
