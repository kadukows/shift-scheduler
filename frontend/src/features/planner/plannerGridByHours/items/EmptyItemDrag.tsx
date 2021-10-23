import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";

import { DndTypes, ItemPassed, getDndTypeForItemId } from "../DndTypes";
import {
    potentialNewShiftSetStart,
    potentationNewShiftReset,
    potentationNewShiftSetSendParam,
    potentationNewShiftSetItemId,
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
    const myRef = React.useRef();

    const [{}, drag] = useDrag(
        () => ({
            type: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
            item: (() => {
                dispatch(potentialNewShiftSetStart(hour.getTime()));
                dispatch(potentationNewShiftSetItemId(itemId));
                return { hour };
            }) as () => ItemPassed.EMPTY_ITEM_DRAG,
            end: () => dispatch(potentationNewShiftReset()),
        }),
        [hour, itemId]
    );

    const [{}, drop] = useDrop(() => ({
        accept: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
        drop: ({ hour }: ItemPassed.EMPTY_ITEM_DRAG) =>
            alert(`Dropped from hour ${hour}`),
        hover: ({}: ItemPassed.EMPTY_ITEM_DRAG) =>
            dispatch(potentationNewShiftSetSendParam(hour.getTime())),
    }));

    React.useEffect(() => {
        drag(myRef.current);
        drop(myRef.current);
    }, [myRef.current]);

    return <MyDiv ref={myRef} />;
};

export default EmptyItemDrag;
