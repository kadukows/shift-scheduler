import * as React from "react";
import { styled } from "@mui/material";
import { addHours } from "date-fns";

import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { useSignal, useSlot } from "../../../eventProvider/EventProvider";
import { RootState } from "../../../../store";
import { useSelector } from "react-redux";

interface Props {}

const sort2Numbers = (lhs: number, rhs: number) =>
    lhs < rhs ? [lhs, rhs] : [rhs, lhs];

const PotentialNewItem = (props: Props) => {
    const { start, end, secondIndexItemId } = useSelector(
        (state: RootState) => state.plannerGridByHoursReducer
    );

    const [xStart, xEnd] = sort2Numbers(start, end);

    const gridArea = useGridArea({
        xStart: new Date(xStart),
        xEnd: new Date(xEnd),
        yStart: { id: secondIndexItemId },
    });

    return start && end && secondIndexItemId ? (
        <PotentialNewShiftDiv style={{ gridArea }} />
    ) : (
        <React.Fragment />
    );
};

export default PotentialNewItem;

/**
 *
 */

const PotentialNewShiftDiv = styled("div")({
    backgroundColor: "rgba(128, 128, 128, 0.6)",
    width: "100%",
    height: "100%",
    zIndex: 0,
});
