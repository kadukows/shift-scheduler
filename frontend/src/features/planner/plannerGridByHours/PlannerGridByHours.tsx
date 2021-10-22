import * as React from "react";
import * as DateFns from "date-fns";

import GenericCssGrid, {
    ItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import { Employee } from "../../employees/employeeSlice";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";
import { useSelector } from "react-redux";
import { Box, Typography, styled } from "@mui/material";
import { SECOND_INDEX } from "./SecondIndexType";

export interface SecondIndexHandler<Item> {
    items: Item[];
    getId: (item: Item) => number;
    getItemFromShift: (shift: Shift) => Item;
    renderShift: (shift: Shift) => React.ReactNode;
    secondIndexType: SECOND_INDEX;
}

export interface Props<Item> {
    timeRange: DateFns.Interval;
    secondIndexHandler: SecondIndexHandler<Item>;
    shifts: Shift[];
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH";

const ItemDiv = styled("div")({
    margin: "4px",
    backgroundColor: "rgb(128, 128, 128)",
});

enum ADDITIONAL_FIELDS {
    HourAnnotation = "HourAnnotation",
    DateAnnotation = "DateAnnotation",
}

const PlannerGridByHours = <Item extends Role | Employee>({
    timeRange,
    secondIndexHandler: {
        items,
        getId,
        getItemFromShift,
        renderShift,
        secondIndexType,
    },
    shifts,
}: Props<Item>) => {
    const [hours, additionalHourAnnotations, additionalDayAnnotations] =
        React.useMemo(() => {
            const hours = DateFns.eachHourOfInterval(timeRange);

            const additionalHourAnnotations: ItemOnGrid<string, string>[] =
                hours.map((date) => ({
                    children: <ItemDiv>{date.getHours()}</ItemDiv>,
                    xStart: DateFns.format(date, TIME_FORMAT),
                    yStart: ADDITIONAL_FIELDS.HourAnnotation,
                }));

            const additionalDayAnnotations: ItemOnGrid<string, string>[] =
                DateFns.eachDayOfInterval(timeRange).map((date) => ({
                    children: (
                        <ItemDiv>{DateFns.format(date, "yyyy-MM-dd")}</ItemDiv>
                    ),
                    xStart: DateFns.format(date, TIME_FORMAT),
                    yStart: ADDITIONAL_FIELDS.DateAnnotation,
                    xEnd: DateFns.format(DateFns.addDays(date, 1), TIME_FORMAT),
                }));

            return [hours, additionalHourAnnotations, additionalDayAnnotations];
        }, [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
        ]);

    const itemsOnGrid = React.useMemo<Array<ItemOnGrid<Date, Item>>>(() => {
        const shiftsWithMargins = getShiftsWithMargins(shifts, hours);

        let result = shiftsWithMargins.map(({ shift, order }) => ({
            children: (
                <Box sx={{ mt: order, ml: order }}>{renderShift(shift)}</Box>
            ),
            xStart: new Date(shift.time_from),
            xEnd: new Date(shift.time_to),
            yStart: getItemFromShift(shift),
            zIndexed: true,
        }));

        return result;
    }, [...shifts.map((shift) => shift.id), secondIndexType]);

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
                items={itemsOnGrid}
                style={{
                    gap: "8px",
                }}
                additionalRows={[
                    ADDITIONAL_FIELDS.DateAnnotation,
                    ADDITIONAL_FIELDS.HourAnnotation,
                ]}
                additionalItems={[
                    ...additionalHourAnnotations,
                    ...additionalDayAnnotations,
                ]}
            />
        </OverflowHelper>
    );
};

export default PlannerGridByHours;

//
//
//

const PaddedDiv = styled("div")({
    p: 4,
    m: 4,
});

const OverflowHelper = ({ children }: React.PropsWithChildren<{}>) => (
    <PaddedDiv
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
    </PaddedDiv>
);

interface ShiftWithOrder {
    shift: Shift;
    order: number;
}

const getShiftsWithMargins = (
    shifts: Shift[],
    hours: Date[]
): ShiftWithOrder[] => {
    //const dateIdxToShifts = new Array<Shift[]>(hours.length).fill(null);
    const TIME_FORMAT = "yyyy-MM-dd'T'HH";
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
