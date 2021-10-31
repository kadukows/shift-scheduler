import * as React from "react";
import * as DateFns from "date-fns";
import { SecondIndexHandler } from "../SecondIndexHandler";
import { RootState } from "../../../store";
import { Shift } from "../../shifts/shiftSlice";
import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import { useSelector } from "react-redux";
import EmptyItem from "./items/EmptyItem";
import OverflowHelper from "../OverflowHelper";
import GenericCssGrid, {
    DefaultItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import DayItem from "./items/DayItem";
import ShiftGroup from "./items/ShiftGroup";

interface Props<Item> {
    timeRange: DateFns.Interval;
    secondIndexHandler: SecondIndexHandler<Item>;
    shiftSelector: (state: RootState) => Shift[];
}

const PlannerGridByDays = <Item extends Role | Employee>({
    timeRange,
    secondIndexHandler: {
        itemSelector,
        getId,
        secondIndexType,
        itemToString,
        ItemComponent,
        getShiftComplementaryFromItemId,
        getItemIdFromShift,
    },
    shiftSelector,
}: Props<Item>) => {
    const days = React.useMemo(
        () => DateFns.eachDayOfInterval(timeRange),
        [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
        ]
    );

    const items = useSelector(itemSelector);
    const shifts = useSelector(shiftSelector);

    const [groupedShifts, emptyItems, genericCssGridProps] =
        React.useMemo(() => {
            const shiftGroupMap = new Map<string, Shift[]>();
            const getKey = (day: Date | number, itemId: number) =>
                `${DateFns.format(day, TIME_FORMAT)}|${itemId}`;

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

            const groupedShifts: Shift[][] = [];
            for (const [_, shifts] of shiftGroupMap.entries()) {
                groupedShifts.push(shifts);
            }

            const emptyItems: JSX.Element[] = [];

            for (const day of days) {
                for (const item of items) {
                    emptyItems.push(<EmptyItem itemId={item.id} day={day} />);
                }
            }

            const genericCssGridProps = {
                x: {
                    cells: days,
                    getId: (date: Date) => DateFns.format(date, TIME_FORMAT),
                },
                y: {
                    cells: items,
                    getId: (item: Item) => getId(item),
                },
                additionalRows: [ADDITIONAL_FIELDS.DateAnnotation],
                additionalCols: [ADDITIONAL_FIELDS.ItemAnnotation],
            };

            return [groupedShifts, emptyItems, genericCssGridProps];
        }, [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
            itemSelector,
            shiftSelector,
        ]);

    return (
        <OverflowHelper>
            <GenericCssGrid<Date, Item>
                {...genericCssGridProps}
                style={{
                    gap: "3px",
                    margin: 8,
                    padding: 8,
                }}
            >
                {days.map((day) => (
                    <DayItem
                        day={day}
                        row={ADDITIONAL_FIELDS.DateAnnotation}
                        key={day.getTime()}
                    />
                ))}
                {groupedShifts.map((shiftGroup) => (
                    <ShiftGroup
                        key={shiftGroup[0].id}
                        shiftIds={shiftGroup.map((shift) => shift.id)}
                        ItemComponent={ItemComponent}
                    />
                ))}
            </GenericCssGrid>
        </OverflowHelper>
    );
};

export default PlannerGridByDays;

/**
 *
 */

const TIME_FORMAT = "yyyy-MM-dd";

enum ADDITIONAL_FIELDS {
    DateAnnotation = "DateAnnotation",
    ItemAnnotation = "ItemAnnotation",
}
