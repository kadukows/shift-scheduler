import * as React from "react";
import { useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { compareAsc } from "date-fns";
import { Stack } from "@mui/material";
import { shiftSelectors } from "../../../shifts/shiftSlice";
import { RootState } from "../../../../store";

interface Props {
    shiftIds: number[];
    ItemComponent: React.FunctionComponent<{ shiftId: number }>;
}

const ShiftGroup = ({ shiftIds, ItemComponent }: Props) => {
    const shifts = useSelector((state: RootState) =>
        selectByIds(state, shiftIds)
    );

    const gridArea = useGridAreaMemo(
        {
            xStart: new Date(shifts[0].time_from),
            xEnd: new Date(shifts[0].time_to),
            yStart: secondIndex,
        },
        [shift.time_from, shift.time_to, secondIndex.id]
    );

    return (
        <Stack direction="row" spacing={1}>
            {shifts.map((shift) => (
                <ItemComponent key={shift.id} shiftId={shift.id} />
            ))}
        </Stack>
    );
};

export default ShiftGroup;

/**
 *
 */
