import * as React from "react";
import * as DateFns from "date-fns";
const sha1 = require("sha1");

import GenericCssGrid, {
    DefaultColumnItemOnGrid,
    DefaultItemOnGrid,
    DefaultRowItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import { Employee } from "../../employees/employeeSlice";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";
import { Box, Typography, styled } from "@mui/material";

import "./style.css";

import EmptyItem from "./items/EmptyItem";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import PotentialNewItem from "./items/PotentialNewItem";
import HourItem from "./items/HourItem";
import DayItem from "./items/DayItem";
import DispatchBatcherProvider from "../../dispatchBatcher/DispatchBatcherProvider";
import {
    SecondIndexHandler,
    SingleShiftItemComponent,
} from "../SecondIndexHandler";
import OverflowHelper from "../OverflowHelper";
import LeftColumnItem from "./items/LeftColumnItem";

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

const EmptyItemLogged = (props: React.ComponentProps<typeof EmptyItem>) => (
    <EmptyItem {...props} />
);
EmptyItemLogged.whyDidYouRender = true;

const PlannerGridByHours = <Item extends Role | Employee>({
    timeRange,
    secondIndexHandler: {
        itemSelector,
        getId,
        secondIndexType,
        itemToString,
        ItemComponent,
        getShiftComplementaryFromItemId,
    },
    shiftSelector,
}: Props<Item>) => {
    const items = useSelector(itemSelector);
    const shifts = useSelector(shiftSelector);

    const [jsxElements, genericCssGridProps] = React.useMemo(() => {
        const result: JSX.Element[] = [];

        result.push(<PotentialNewItem key="PotentialNewItem" />);

        const hours = DateFns.eachHourOfInterval(timeRange);

        for (const hour of hours) {
            for (const item of items) {
                result.push(
                    <EmptyItem
                        itemId={item.id}
                        hour={hour}
                        key={`empty-${hour.getTime()}-${secondIndexType}-${
                            item.id
                        }`}
                        getShiftComplementaryFromItemId={
                            getShiftComplementaryFromItemId
                        }
                    />
                );
            }
        }

        for (const hour of hours) {
            result.push(
                <HourItem
                    hour={hour}
                    row={ADDITIONAL_FIELDS.HourAnnotation}
                    key={`hour-${hour.getTime()}`}
                />
            );
        }

        const days = DateFns.eachDayOfInterval(timeRange);
        for (const day of days) {
            result.push(
                <DayItem
                    day={day}
                    row={ADDITIONAL_FIELDS.DateAnnotation}
                    key={`day-${day.getTime()}`}
                />
            );
        }

        for (const item of items) {
            result.push(
                <LeftColumnItem
                    xStart={ADDITIONAL_FIELDS.ItemAnnotation}
                    yStart={item}
                    key={`item-${item.id}`}
                >
                    {itemToString(item)}
                </LeftColumnItem>
            );
        }

        result.push(
            <LeftColumnItem
                xStart={ADDITIONAL_FIELDS.ItemAnnotation}
                yStart={ADDITIONAL_FIELDS.HourAnnotation}
                corner
                key="item-hour"
            />
        );

        result.push(
            <LeftColumnItem
                xStart={ADDITIONAL_FIELDS.ItemAnnotation}
                yStart={ADDITIONAL_FIELDS.DateAnnotation}
                corner
                key="item-date"
            />
        );

        const CastedComponent = ItemComponent as SingleShiftItemComponent;

        for (const shift of shifts) {
            result.push(
                <CastedComponent
                    key={`shift-${secondIndexType}-${shift.id}`}
                    shiftId={shift.id}
                />
            );
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
        shiftSelector,
        sha1(shifts.map((shift) => shift.id)),
        sha1(items.map((item) => item.id)),
    ]);

    return (
        <DispatchBatcherProvider timeout={30}>
            <OverflowHelper>
                <Box sx={{ m: 2, p: 2, display: "inline-block" }}>
                    <GenericCssGrid<Date, Item>
                        {...genericCssGridProps}
                        gap="1px"
                    >
                        {jsxElements}
                    </GenericCssGrid>
                </Box>
            </OverflowHelper>
        </DispatchBatcherProvider>
    );
};

export default React.memo(PlannerGridByHours);

//

PlannerGridByHours.whyDidYouRender = true;
