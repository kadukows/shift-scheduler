import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";

import { DndTypes, ItemPassed, getDndTypeForItemId } from "../DndTypes";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { Role } from "../../../roles/rolesSlice";
import { Employee } from "../../../employees/employeeSlice";
import { BorderedDiv } from "./StyledDiv";
import { EventTypes, CallbackTypes } from "../EventTypes";
import { useSignal } from "../../../eventProvider/EventProvider";

interface Props<Item> {
    hour: Date;
    item: Item;
}

export const MyDiv = styled(BorderedDiv)({
    backgroundColor: "rgba(128, 128, 128, 0)",
    ":hover": {
        backgroundColor: "rgba(128, 128, 128, 0.2)",
    },
});

const EmptyItem = <Item extends Role | Employee>({
    hour,
    item,
    ...rest
}: Props<Item>) => {
    const myRef = React.useRef();
    const gridArea = useGridArea<Date, Item>({ xStart: hour, yStart: item });

    const startDragSignal: CallbackTypes.POTENTIAL_NEW_SHIFT_START_DRAG =
        useSignal(EventTypes.POTENTIAL_NEW_SHIFT_START_DRAG);
    const endDragSignal: CallbackTypes.POTENTIAL_NEW_SHIFT_END_DRAG = useSignal(
        EventTypes.POTENTIAL_NEW_SHIFT_END_DRAG
    );
    const hoverSignal: CallbackTypes.POTENTIAL_NEW_SHIFT_HOVER = useSignal(
        EventTypes.POTENTIAL_NEW_SHIFT_HOVER
    );

    const [{}, drag] = useDrag(
        () => ({
            type: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, item.id),
            item: (() => {
                startDragSignal({ start: hour.getTime(), itemId: item.id });
                return { hour };
            }) as () => ItemPassed.EMPTY_ITEM_DRAG,
            end: () => endDragSignal(),
        }),
        [hour.getTime(), item.id]
    );

    const [{}, drop] = useDrop(
        () => ({
            accept: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, item.id),
            drop: ({ hour }: ItemPassed.EMPTY_ITEM_DRAG) => {
                console.log(`Dropped from hour ${hour}`);
            },
        }),
        [hour.getTime(), item.id]
    );

    React.useEffect(() => {
        drag(myRef.current);
        drop(myRef.current);
    }, [myRef.current]);

    return (
        <MyDiv
            onDragEnter={() => hoverSignal(hour.getTime())}
            style={{ gridArea, zIndex: 1 }}
            {...rest}
            ref={myRef}
        />
    );
};

export default EmptyItem;

//const shouldDispatchSetSendParam()
