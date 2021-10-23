import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { useDrop } from "react-dnd";

import { DndTypes, ItemPassed, getDndTypeForItemId } from "../DndTypes";
import {
    potentialNewShiftSetStart,
    potentationNewShiftReset,
    potentationNewShiftSetSendParam,
    potentationNewShiftSetItemId,
    setIsDragging,
} from "../plannerByHoursSlice";

interface Props {
    hour: Date;
    itemId: number; // either role or an employee id
}

export const MyDiv = styled("div")({
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(128, 128, 128, 0)",
    ":hover": {
        backgroundColor: "rgba(128, 128, 128, 0.2)",
    },
});

const EmptyItemDrag = ({ hour, itemId }: Props) => {
    const dispatch = useDispatch();

    const [{}, drop] = useDrop(() => ({
        accept: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
        drop: ({ hour }: ItemPassed.EMPTY_ITEM_DRAG) =>
            alert(`Dropped from hour ${hour}`),
        hover: ({}: ItemPassed.EMPTY_ITEM_DRAG) =>
            dispatch(potentationNewShiftSetSendParam(hour.getTime())),
    }));

    return <MyDiv ref={drop} />;
};

export default EmptyItemDrag;
