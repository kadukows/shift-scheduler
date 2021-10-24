import * as React from "react";
import * as DateFns from "date-fns";

import GenericCssGrid, {
    DefaultColumnItemOnGrid,
    DefaultItemOnGrid,
    DefaultRowItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import { Employee } from "../../employees/employeeSlice";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";
import { Box, Typography, styled } from "@mui/material";
import { SECOND_INDEX } from "./SecondIndexType";

import "./style.css";

import EmptyItem from "./items/EmptyItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import PotentialNewItem from "./items/PotentialNewItem";
import HourItem from "./items/HourItem";
import DayItem from "./items/DayItem";

export interface SecondIndexHandler<Item> {
    items: Item[];
    getId: (item: Item) => number;
    getItemFromShift: (shift: Shift) => Item;
    renderShift: (shift: Shift) => React.ReactNode;
    secondIndexType: SECOND_INDEX;
    itemToString: (item: Item) => string;
}

export interface Props<Item> {
    timeRange: DateFns.Interval;
    secondIndexHandler: SecondIndexHandler<Item>;
    shifts: Shift[];
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH";

enum ADDITIONAL_FIELDS {
    HourAnnotation = "HourAnnotation",
    DateAnnotation = "DateAnnotation",
    ItemAnnotation = "ItemAnnotation",
}

//
//
//

const PlannerGridByHours = <Item extends Role | Employee>({
    timeRange,
    secondIndexHandler: {
        items,
        getId,
        getItemFromShift,
        renderShift,
        secondIndexType,
        itemToString,
    },
    shifts,
}: Props<Item>) => {
    const hours = React.useMemo(
        () => DateFns.eachHourOfInterval(timeRange),
        [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
        ]
    );

    const emptyItems = React.useMemo(() => {
        const result: JSX.Element[] = [];

        for (const hour of hours) {
            for (const item of items) {
                result.push(
                    <EmptyItem
                        item={item}
                        hour={hour}
                        key={`${hour.getTime()}-${secondIndexType}-${item.id}`}
                        style={{
                            zIndex: 1,
                        }}
                    />
                );
            }
        }

        return result;
    }, [hours, ...items.map(getId)]);

    return (
        <OverflowHelper>
            <GenericCssGrid<Date, Item>
                x={{
                    cells: hours,
                    getId: (date: Date) => DateFns.format(date, TIME_FORMAT),
                }}
                y={{
                    cells: items,
                    getId: (item) => getId(item),
                }}
                style={{
                    gap: "1px",
                    margin: 8,
                    padding: 8,
                }}
                additionalRows={[
                    ADDITIONAL_FIELDS.DateAnnotation,
                    ADDITIONAL_FIELDS.HourAnnotation,
                ]}
                additionalCols={[ADDITIONAL_FIELDS.ItemAnnotation]}
            >
                <PotentialNewItem />
                {hours.map((hour) => (
                    <HourItem
                        hour={hour}
                        row={ADDITIONAL_FIELDS.HourAnnotation}
                        key={hour.getTime()}
                    />
                ))}
                {DateFns.eachDayOfInterval(timeRange).map((day) => (
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
                        {itemToString(item)}
                    </DefaultRowItemOnGrid>
                ))}
                {emptyItems}
            </GenericCssGrid>
        </OverflowHelper>
    );
};

export default PlannerGridByHours;

//
//
//

//
//
//

const OverflowHelper = ({ children }: React.PropsWithChildren<{}>) => (
    <div
        style={{
            display: "flex",
            flexDirection: "row",
        }}
    >
        <div
            style={{
                width: 0,
                flex: "1 1 100%",
            }}
        >
            <div
                style={{
                    overflowX: "auto",
                    width: "100%",
                    height: "100%",
                }}
            >
                {children}
            </div>
        </div>
    </div>
);

interface ShiftWithOrder {
    shift: Shift;
    order: number;
}

const getShiftsWithMargins = (
    shifts: Shift[],
    hours: Date[]
): ShiftWithOrder[] => {
    const dateToShifts = new Map<string, Shift[]>();

    for (const shift of shifts) {
        const interval = {
            start: Date.parse(shift.time_from),
            end: Date.parse(shift.time_to),
        };
        const hoursInShift = DateFns.eachHourOfInterval(interval);

        // check if we need to additionally remove any other shift
        const temporarilyDeleted: Shift[] = [];
        for (const hour of hoursInShift) {
            const hourFormatted = DateFns.format(hour, TIME_FORMAT);
            if (dateToShifts.has(hourFormatted)) {
                // we need to temporarily remove shifts
                const toRemove = dateToShifts.get(hourFormatted);

                const removeKeyWithDirection = (offset: number) => {
                    let key = DateFns.addHours(hour, offset);
                    let keyFormatted = DateFns.format(key, TIME_FORMAT);
                    while (
                        dateToShifts.has(keyFormatted) &&
                        dateToShifts.get(keyFormatted) == toRemove
                    ) {
                        dateToShifts.delete(keyFormatted);
                        key = DateFns.addHours(key, offset);
                        keyFormatted = DateFns.format(key, TIME_FORMAT);
                    }
                };

                removeKeyWithDirection(1);
                removeKeyWithDirection(-1);
                dateToShifts.delete(hourFormatted);
                temporarilyDeleted.push(...toRemove);
            }
        }

        const newJointShifts = [shift, ...temporarilyDeleted];
        const newJointInterval: DateFns.Interval = {
            start: minimumHour(newJointShifts),
            end: maximumHour(newJointShifts),
        };
        const newJointIntervalHours =
            DateFns.eachHourOfInterval(newJointInterval);

        for (const hourInNewJointInterval of newJointIntervalHours) {
            const formatted = DateFns.format(
                hourInNewJointInterval,
                TIME_FORMAT
            );

            if (dateToShifts.has(formatted)) {
                throw "getShiftsWithMargins(): there are shifts in interval even after deletion";
            }

            dateToShifts.set(formatted, newJointShifts);
        }
    }

    const groupedShifts = new Set<Shift[]>();
    for (const shiftGroup of dateToShifts.values()) {
        groupedShifts.add(shiftGroup);
    }

    const result: ShiftWithOrder[] = [];
    for (const shiftGroup of groupedShifts) {
        const sorted = shiftGroup.sort(
            (a, b) => Date.parse(a.time_from) - Date.parse(b.time_from)
        );

        let order = 0;
        for (const shift of sorted) {
            result.push({
                shift,
                order,
            });
            order += 1;
        }
    }

    return result;
};

const minimumHour = (shifts: Shift[]) =>
    DateFns.startOfHour(
        shifts
            .map((shift) => Date.parse(shift.time_from))
            .reduce((a, b) => Math.min(a, b))
    );

const maximumHour = (shifts: Shift[]) =>
    DateFns.startOfHour(
        shifts
            .map((shift) => Date.parse(shift.time_to))
            .reduce((a, b) => Math.max(a, b))
    );

const unpackShift = ({
    id,
    schedule,
    employee,
    time_from,
    time_to,
    role,
}: Shift) => [id, schedule, employee, time_from, time_to, role];

const getItemToShifts = <Item extends unknown>(
    shifts: Shift[],
    getItemFromShift: (shift: Shift) => Item
) => {
    const result = new Map<Item, Shift[]>();

    for (const shift of shifts) {
        const item = getItemFromShift(shift);
        if (result.has(item)) {
            result.get(item).push(shift);
        } else {
            result.set(item, [shift]);
        }
    }

    return result;
};

const BorderDiv = styled("div")({
    zIndex: 0,
    width: "100%",
    height: "100%",
    outline: "1px solid rgba(128, 128, 128, 0.4)",
});
