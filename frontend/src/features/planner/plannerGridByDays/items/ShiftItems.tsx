import * as React from "react";
import * as DateFns from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Shift } from "../../../shifts/shiftSlice";
import ShiftGroup from "./ShiftGroup";

interface Props {
    shiftSelector: (state: RootState) => Shift[];
    getItemIdFromShift: (shift: Shift) => number;
    ItemComponent: React.FunctionComponent<{ shiftId: number }>;
}

const ShiftItems = ({
    shiftSelector,
    getItemIdFromShift,
    ItemComponent,
}: Props) => {
    const shifts = useSelector(shiftSelector);

    const groupedShifts = React.useMemo(() => {
        const shiftGroupMap = new Map<string, Shift[]>();

        for (const shift of shifts) {
            const key = getKey(
                Date.parse(shift.time_from),
                getItemIdFromShift(shift)
            );

            if (shiftGroupMap.has(key)) {
                shiftGroupMap.get(key).push(shift);
            } else {
                shiftGroupMap.set(key, [shift]);
            }
        }

        return [...shiftGroupMap.values()];
    }, [getItemIdFromShift, ...unpackShifts(shifts)]);

    return (
        <React.Fragment>
            {groupedShifts.map((shifts) => (
                <ShiftGroup
                    key={shifts[0].id}
                    shiftIds={shifts.map((shift) => shift.id)}
                    ItemComponent={ItemComponent}
                />
            ))}
        </React.Fragment>
    );
};

export default ShiftItems;

/**
 *
 */

const unpackShifts = (shifts: Shift[]) => {
    const result = [];

    for (const shift of shifts) {
        result.push(shift.time_from);
        result.push(shift.time_to);
    }

    return result;
};

const getKey = (day: Date | number, itemId: number) =>
    `${DateFns.format(day, TIME_FORMAT)}|${itemId}`;

const TIME_FORMAT = "yyyy-MM-dd";
