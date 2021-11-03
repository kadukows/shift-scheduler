import * as React from "react";
import * as DateFns from "date-fns";
import { Typography } from "@mui/material";
import {
    MultipleShiftItemComponent,
    SecondIndexHandler,
} from "../SecondIndexHandler";
import { RootState } from "../../../store";
import { Shift } from "../../shifts/shiftSlice";
import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import { useSelector } from "react-redux";
import EmptyItem from "./items/EmptyItem";
import OverflowHelper from "../OverflowHelper";
import GenericCssGrid, {
    DefaultItemOnGrid,
    DefaultRowItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import DayItem from "./items/DayItem";
import GridItemsFactory from "./items/GridItemsFactory";

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
    children,
}: React.PropsWithChildren<Props<Item>>) => {
    const days = React.useMemo(
        () => DateFns.eachDayOfInterval(timeRange),
        [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
        ]
    );

    const items = useSelector(itemSelector);
    const shifts = useSelector(shiftSelector);

    const { genericCssGridProps } = React.useMemo(() => {
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

        interface DayItemShifts {
            day: Date;
            item: Item;
            shifts: Shift[];
        }

        const dayItemShiftsArray = [] as DayItemShifts[];

        for (const day of days) {
            for (const item of items) {
                const key = getKey(day, item.id);

                dayItemShiftsArray.push({
                    day,
                    item,
                    shifts: shiftGroupMap.has(key)
                        ? shiftGroupMap.get(key)
                        : [],
                });
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

        return {
            dayItems: dayItemShiftsArray.map(({ day, item, ...rest }) => ({
                day,
                item,
            })),
            genericCssGridProps,
        };
    }, [
        DateFns.getUnixTime(timeRange.start),
        DateFns.getUnixTime(timeRange.end),
        itemSelector,
    ]);

    const gridItems: JSX.Element[] = [];

    for (const day of days) {
        for (const item of items) {
            gridItems.push(
                <GridItemsFactory
                    day={day}
                    itemId={item.id}
                    ItemComponent={ItemComponent as MultipleShiftItemComponent}
                    getItemIdFromShift={getItemIdFromShift}
                    key={getKey(day, item.id)}
                />
            );
        }
    }

    return (
        <React.Fragment>
            {children}
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
                    {items.map((item) => (
                        <DefaultRowItemOnGrid<Item>
                            xStart={ADDITIONAL_FIELDS.ItemAnnotation}
                            yStart={item}
                            key={item.id}
                        >
                            <Typography align="center" sx={{ p: 2 }}>
                                {itemToString(item)}
                            </Typography>
                        </DefaultRowItemOnGrid>
                    ))}
                    {/*dayItemShiftsArray.map(({ day, item, shifts }) =>
                        shifts.length === 0 ? (
                            <EmptyItem
                                key={getKey(day, item.id)}
                                day={day}
                                itemId={item.id}
                            />
                        ) : (
                            <CastedComponent
                                key={shifts[0].id}
                                shiftsIds={shifts.map((shift) => shift.id)}
                            />
                        )
                        )*/}
                    {gridItems}
                </GenericCssGrid>
            </OverflowHelper>
        </React.Fragment>
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

const getKey = (day: Date | number, itemId: number) =>
    `${DateFns.format(day, TIME_FORMAT)}|${itemId}`;