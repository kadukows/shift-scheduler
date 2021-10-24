import * as React from "react";
import { styled } from "@mui/material";
import { addHours } from "date-fns";

import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { useSlot } from "../../../eventProvider/EventProvider";

interface Props {}

interface NumberInterval {
    start: number;
    end: number;
}

enum NumberIntervalActionType {
    SET_START = "SET_START",
    SET_END = "SET_END",
    RESET = "RESET",
}

interface NumberIntervalAction {
    type: NumberIntervalActionType;
    payload: number;
}

const reducer = (state: NumberInterval, action: NumberIntervalAction) => {
    switch (action.type) {
        case NumberIntervalActionType.SET_START:
            return { start: action.payload, end: null };
        case NumberIntervalActionType.SET_END:
            if (state.end !== action.payload) {
                console.log("hover on: ", action.payload);
                return { ...state, end: action.payload };
            } else {
                return state;
            }
        case NumberIntervalActionType.RESET:
            return { start: null, end: null };
        default:
            return state;
    }
};

const PotentialNewItem = (props: Props) => {
    const [start, setStart] = React.useState<number>(null);
    const [end, setEnd] = React.useState<number>(null);
    const [itemId, setItemId] = React.useState<number>(null);

    const startDragCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_START_DRAG = (
        event
    ) => {
        setStart(event.start);
        setItemId(event.itemId);
        console.log("drag start");
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_START_DRAG, startDragCallback);

    const hoverCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_HOVER = (end) => {
        setEnd(end);
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_HOVER, hoverCallback);

    const endDragCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_END_DRAG = () => {
        setItemId(null);
        setStart(null);
        setEnd(null);
        console.log("end drag");
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_END_DRAG, endDragCallback);

    const getXDesc = () => {
        if (start === null || end === null)
            return {
                xStart: new Date(0),
            };

        return start < end
            ? { xStart: new Date(start), xEnd: addHours(end, 1) }
            : { xStart: new Date(end), xEnd: addHours(start, 1) };
    };

    const gridArea = useGridArea({
        yStart: { id: itemId },
        ...getXDesc(),
    });

    return <PotentialNewShiftDiv style={{ gridArea }} />;
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
