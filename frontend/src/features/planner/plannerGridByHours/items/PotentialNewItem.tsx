import * as React from "react";
import { styled } from "@mui/material";
import { addHours } from "date-fns";

import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { useSignal, useSlot } from "../../../eventProvider/EventProvider";

interface Props {
    eventType: EventTypes;
}

interface NumberInterval {
    start: number;
    end: number;
}

const PotentialNewItem = ({ eventType }: Props) => {
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

    const sendArgsToDialog:
        | CallbackTypes.ADD_BY_EMPLOYEE
        | CallbackTypes.ADD_BY_ROLE = useSignal(eventType);

    const endDragCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_END_DRAG = () => {
        sendArgsToDialog({
            start,
            end,
            secondIndexItemId: itemId,
        });

        setItemId(null);
        setStart(null);
        setEnd(null);
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_END_DRAG, endDragCallback, [
        start,
        end,
        itemId,
    ]);

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
