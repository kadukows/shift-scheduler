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

export interface Props<Item> {
    //timeRange: DateFns.Interval;
    timeStart: number;
    timeEnd: number;

    secondIndexHandler: SecondIndexHandler<Item>;

    //shiftSelector: (state: RootState) => Shift[];
    itemIds: number[];
    shiftIds: number[];
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
    timeStart,
    timeEnd,
    secondIndexHandler: {
        itemSelector,
        getId,
        secondIndexType,
        itemToString,
        ItemComponent,
        getShiftComplementaryFromItemId,
    },
    shiftIds,
}: Props<Item>) => {
    const items = useSelector(itemSelector);
    const shifts = useSelector(shiftSelector);

    const [jsxElements, genericCssGridProps] = React.useMemo(() => {
        console.log("Calculating jsxElements");

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
                <DefaultRowItemOnGrid<Item>
                    xStart={ADDITIONAL_FIELDS.ItemAnnotation}
                    yStart={item}
                    key={`item-${item.id}`}
                    style={{
                        alignContent: "center",
                    }}
                >
                    <Typography noWrap sx={{ mr: 0.7 }}>
                        {itemToString(item)}
                    </Typography>
                </DefaultRowItemOnGrid>
            );
        }

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
    ]);

    return (
        <OverflowHelper>
            <DispatchBatcherProvider timeout={30}>
                <Box sx={{ m: 2, p: 2 }}>
                    <GenericCssGrid<Date, Item>
                        {...genericCssGridProps}
                        gap="1px"
                    >
                        {jsxElements}
                    </GenericCssGrid>
                </Box>
            </DispatchBatcherProvider>
        </OverflowHelper>
    );
};

const arePropsEqual = (prev: Props<any>, curr: Props<any>) => {
    return (
        DateFns.isEqual(prev.timeRange.start, curr.timeRange.start) &&
        DateFns.isEqual(prev.timeRange.end, curr.timeRange.end) &&
        Object.is(prev.secondIndexHandler, curr.secondIndexHandler) &&
        Object.is(prev.shiftSelector, curr.shiftSelector)
    );
};

export default React.memo(PlannerGridByHours);

//

PlannerGridByHours.whyDidYouRender = true;
