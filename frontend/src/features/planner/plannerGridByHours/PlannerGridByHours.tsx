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
        getShiftComplementaryFromItemId,
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
                        itemId={item.id}
                        hour={hour}
                        key={`${hour.getTime()}-${secondIndexType}-${item.id}`}
                        getShiftComplementaryFromItemId={
                            getShiftComplementaryFromItemId
                        }
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

    const CastedComponent = ItemComponent as SingleShiftItemComponent;

    return (
        <OverflowHelper>
            <DispatchBatcherProvider timeout={30}>
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
                            style={{
                                alignContent: "center",
                            }}
                        >
                            <Typography noWrap sx={{ mr: 0.7 }}>
                                {itemToString(item)}
                            </Typography>
                        </DefaultRowItemOnGrid>
                    ))}
                    {emptyItems}
                    {shifts.map((shift) => (
                        <CastedComponent
                            key={`${secondIndexType}-${shift.id}`}
                            shiftId={shift.id}
                        />
                    ))}
                </GenericCssGrid>
            </DispatchBatcherProvider>
        </OverflowHelper>
    );
};

export default PlannerGridByHours;
