import * as React from "react";
import { styled } from "@mui/material";

import { EventTypes, CallbackTypes } from "../EventTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { useSlot } from "../../../eventProvider/EventProvider";

interface Props {}

interface NumberInterval {
    start: number;
    end: number;
}

const PotentialNewItem = (props: Props) => {
    const [interval, setInterval] = React.useState<NumberInterval>({
        start: null,
        end: null,
    });
    const [itemId, setItemId] = React.useState<number>(null);

    const startDragCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_START_DRAG = (
        event
    ) => {
        setInterval({ start: event.start, end: null });
        setItemId(event.itemId);
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_START_DRAG, startDragCallback);

    const hoverCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_HOVER = (end) => {
        if (end !== interval.end) {
            setInterval({ start: interval.start, end: end });
        }
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_HOVER, hoverCallback);

    const endDragCallback: CallbackTypes.POTENTIAL_NEW_SHIFT_END_DRAG = () => {
        setItemId(null);
        setInterval({ start: null, end: null });
    };
    useSlot(EventTypes.POTENTIAL_NEW_SHIFT_END_DRAG, endDragCallback);

    return interval.start !== null &&
        interval.end !== null &&
        itemId !== null ? (
        <PotentialNewItemImpl {...interval} itemId={itemId} />
    ) : (
        <React.Fragment />
    );
};

export default PotentialNewItem;

/**
 *
 */

interface PotentialNewItemImplProps {
    start: number;
    end: number;
    itemId: number;
}

const PotentialNewItemImpl = ({
    start,
    end,
    itemId,
}: PotentialNewItemImplProps) => {
    const getXDesc = () => {
        return start < end
            ? { xStart: new Date(start), xEnd: new Date(end) }
            : { xStart: new Date(end), xEnd: new Date(start) };
    };

    const gridArea = useGridArea({
        yStart: { id: itemId },
        ...getXDesc(),
    });

    return <PotentialNewShiftDiv style={{ gridArea }} />;
};

const PotentialNewShiftDiv = styled("div")({
    backgroundColor: "rgba(128, 128, 128, 0.6)",
    width: "100%",
    height: "100%",
    zIndex: 0,
});
