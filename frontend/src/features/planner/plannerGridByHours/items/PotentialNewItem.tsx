import * as React from "react";
import { styled } from "@mui/material";
import { addHours } from "date-fns";

import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridAreaMemo } from "../../../genericCssGrid/GenericCssGrid";
import { useSignal, useSlot } from "../../../eventProvider/EventProvider";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";

interface Props {}

const sort2Numbers = (lhs: number, rhs: number) =>
    lhs < rhs ? [lhs, rhs] : [rhs, lhs];

const PotentialNewItem = (props: Props) => {
    const { start, end, secondIndexItemId } = useSelector(
        (state: RootState) => state.potentialNewItemReducer
    );

    return start !== null && end !== null && secondIndexItemId !== null ? (
        <PotentialNewShiftSet
            xStart={start}
            xEnd={end}
            yStart={secondIndexItemId}
        />
    ) : (
        <React.Fragment />
    );
};

export default PotentialNewItem;

/**
 *
 */

interface PotentialNewShiftSetProps {
    xStart: number;
    xEnd: number;
    yStart: number;
}

const PotentialNewShiftSet = ({
    xStart,
    xEnd,
    yStart,
}: PotentialNewShiftSetProps) => {
    const [newStart, newEnd] = sort2Numbers(xStart, xEnd);

    const gridArea = useGridAreaMemo(
        {
            xStart: new Date(newStart),
            xEnd: new Date(newEnd),
            // this hacks the way x.getId works insisde generic css grid
            // bascially, getId is just (a) => a.id for both Employee and
            // Role indexd grid
            // so as to not pass selectors for accurate types
            // we just hack it with this monstrosity
            yStart: { id: yStart },
        },
        [xStart, yStart, xEnd]
    );

    return <PotentialNewShiftDiv style={{ gridArea }} />;
};

const PotentialNewShiftDiv = styled("div")({
    backgroundColor: "rgba(128, 128, 128, 0.6)",
    width: "100%",
    height: "100%",
    zIndex: 0,
});
