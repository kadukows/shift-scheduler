import * as React from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Employee } from "../../../employees/employeeSlice";
import { Role } from "../../../roles/rolesSlice";
import { MultipleShiftItemComponent } from "../../SecondIndexHandler";
import { RootState } from "../../../../store";
import { Shift, shiftSelectors } from "../../../shifts/shiftSlice";
import { compareAsc, isEqual, startOfDay } from "date-fns";
import { useSelector } from "react-redux";
import EmptyItem from "./EmptyItem";

interface Props<SecondIndex> {
    day: Date;
    itemId: number;

    getItemIdFromShift: (shift: Shift) => number;
    ItemComponent: MultipleShiftItemComponent;
}

const GridItemsFactory = <SecondIndex extends Role | Employee>({
    day,
    itemId,
    getItemIdFromShift,
    ItemComponent,
}: Props<SecondIndex>) => {
    const shifts = useSelector((state: RootState) =>
        getShiftsByTimeRange(state, day, getItemIdFromShift, itemId)
    );

    return shifts.length === 0 ? (
        <EmptyItem day={day} itemId={itemId} />
    ) : (
        <ItemComponent shiftsIds={shifts.map((shift) => shift.id)} />
    );
};

export default GridItemsFactory;

/**
 *
 */

const getShiftsByTimeRange: (
    state: RootState,
    day: Date,
    getItemIdFromShift: (shift: Shift) => number,
    itemId: number
) => Shift[] = createSelector(
    [
        (state: RootState) => shiftSelectors.selectAll(state),
        (state: RootState, day: Date) => day,
        (
                state: RootState,
                day: Date,
                getItemIdFromShift: (shift: Shift) => number,
                itemId: number
            ) =>
            (shift: Shift) =>
                getItemIdFromShift(shift) === itemId,
    ],
    (shifts, day, pred) =>
        shifts.filter(
            (shift) =>
                isEqual(
                    startOfDay(day),
                    startOfDay(Date.parse(shift.time_from))
                ) && pred(shift)
        )
);
