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
    itemSelector: (state: RootState) => Item[];
    getId: (item: Item) => number;
    secondIndexType: SECOND_INDEX;
    itemToString: (item: Item) => string;
    ItemComponent: React.FunctionComponent<{ shiftId: number }>;
}

export interface Props<Item> {
    timeRange: DateFns.Interval;
    secondIndexHandler: SecondIndexHandler<Item>;
    shiftSelector: (state: RootState) => Shift[];
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
        itemSelector,
        getId,
        secondIndexType,
        itemToString,
        ItemComponent,
    },
    shiftSelector,
}: Props<Item>) => {
    const hours = React.useMemo(
        () => DateFns.eachHourOfInterval(timeRange),
        [
            DateFns.getUnixTime(timeRange.start),
            DateFns.getUnixTime(timeRange.end),
        ]
    );

    const items = useSelector(itemSelector);

    const [emptyItems, genericCssGridProps] = React.useMemo(() => {
        const result: JSX.Element[] = [];

        for (const hour of hours) {
            for (const item of items) {
                result.push(
                    <EmptyItem
                        item={item}
                        hour={hour}
                        key={`${hour.getTime()}-${secondIndexType}-${item.id}`}
                    />
                );
            }
        }

        const genericCssGridProps = {
            x: {
                cells: hours,
                getId: (date: Date) => DateFns.format(date, TIME_FORMAT),
            },
            y: {
                cells: items,
                getId: (item: Item) => getId(item),
            },
            additionalRows: [
                ADDITIONAL_FIELDS.DateAnnotation,
                ADDITIONAL_FIELDS.HourAnnotation,
            ],
            additionalCols: [ADDITIONAL_FIELDS.ItemAnnotation],
        };

        return [result, genericCssGridProps];
    }, [
        DateFns.getUnixTime(timeRange.start),
        DateFns.getUnixTime(timeRange.end),
        itemSelector,
    ]);

    const shifts = useSelector(shiftSelector);

    return (
        <OverflowHelper>
            <GenericCssGrid<Date, Item>
                {...genericCssGridProps}
                style={{
                    gap: "1px",
                    margin: 8,
                    padding: 8,
                }}
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
                {shifts.map((shift) => (
                    <ItemComponent
                        key={`${secondIndexType}-${shift.id}`}
                        shiftId={shift.id}
                    />
                ))}
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
