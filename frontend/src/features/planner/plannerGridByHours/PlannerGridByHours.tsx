import * as React from "react";
import * as DateFns from "date-fns";

import GenericCssGrid, {
    ItemOnGrid,
} from "../../genericCssGrid/GenericCssGrid";
import { Employee } from "../../employees/employeeSlice";
import { Role, roleSelectors } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";
import { styled } from "@mui/system";
import { useSelector } from "react-redux";
import { Typography } from "@mui/material";

export interface SecondIndexHandler<Item> {
    items: Item[];
    getId: (item: Item) => number;
    getItemFromShift: (shift: Shift) => Item;
}

export interface Props<Item> {
    timeRange: DateFns.Interval;
    secondIndexHandler: SecondIndexHandler<Item>;
    shifts: Shift[];
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH";

const ItemDiv = styled("div")({
    borderRadius: "4px",
    background: "rgb(128, 128, 128)",
    padding: "4px",
    margin: "4px",
    textAlign: "center",
});

enum ADDITIONAL_FIELDS {
    HourAnnotation = "HourAnnotation",
    DateAnnotation = "DateAnnotation",
}

const PlannerGridByHours = <Item extends Role | Employee>({
    timeRange,
    secondIndexHandler: { items, getId, getItemFromShift },
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
        }, [timeRange.start.toString(), timeRange.end.toString()]);

    const rolesById = useSelector(roleSelectors.selectEntities);

    const itemsOnGrid = React.useMemo(
        () => {
            let result = shifts.map((shift) => ({
                children: (
                    <ItemDiv>
                        <Typography>
                            {rolesById[shift.role].name}
                            <br />
                            {DateFns.format(
                                Date.parse(shift.time_from),
                                "HH:mm"
                            )}
                            --
                            {DateFns.format(Date.parse(shift.time_to), "HH:mm")}
                        </Typography>
                    </ItemDiv>
                ),
                xStart: new Date(shift.time_from),
                xEnd: new Date(shift.time_to),
                yStart: getItemFromShift(shift),
            }));

            return result;
        },
        shifts.map((shift) => shift.id)
    );

    //const additionalItemsOnGrid = React.useMemo;

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
