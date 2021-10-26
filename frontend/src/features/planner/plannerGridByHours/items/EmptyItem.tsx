import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { useDrag, useDrop } from "react-dnd";
import { addHours } from "date-fns";

import { DndTypes, ItemPassed, getDndTypeForItemId } from "../DndTypes";
import {
    useGridArea,
    useGridAreaMemo,
} from "../../../genericCssGrid/GenericCssGrid";
import { Role } from "../../../roles/rolesSlice";
import { Employee } from "../../../employees/employeeSlice";
import { BorderedDiv } from "./StyledDiv";
import { set, reset } from "../potentialNewItemSlice";
import { set as addDialogSet } from "../addDialogSlice";

interface Props {
    hour: Date;
    itemId: number;
}

export const MyDiv = styled(BorderedDiv)({
    backgroundColor: "rgba(128, 128, 128, 0)",
    ":hover": {
        backgroundColor: "rgba(128, 128, 128, 0.2)",
    },
});

const EmptyItem = <Item extends Role | Employee>({
    hour,
    itemId,
    ...rest
}: Props) => {
    const myRef = React.useRef();
    const [entered, setEntered] = React.useState(false);
    const gridArea = useGridAreaMemo({ xStart: hour, yStart: { id: itemId } }, [
        hour.getTime(),
        itemId,
    ]);
    const dispatch = useDispatch();

    const [{}, drag] = useDrag(
        () => ({
            type: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
            item: { itemId, hour: hour.getTime() },
            end: () => {
                dispatch(reset());
            },
        }),
        [hour.getTime(), itemId]
    );

    const [{}, drop] = useDrop(
        () => ({
            accept: [
                DndTypes.SHIFT_ITEM_DRAG,
                getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
            ],
            drop: (item: ItemPassed.EMPTY_ITEM_DRAG) => {
                dispatch(
                    addDialogSet({
                        start: item.hour,
                        end: addHours(hour, 1).getTime(),
                        secondIndexItemId: item.itemId,
                        open: true,
                    })
                );
            },
            canDrop: (item) => {
                return item.hour !== hour.getTime();
            },
            hover: (item, monitor) => {
                if (entered && monitor.canDrop()) {
                    dispatch(
                        set({
                            start: item.hour,
                            end: addHours(hour, 1).getTime(),
                            secondIndexItemId: item.itemId,
                        })
                    );
                    setEntered(false);
                }
            },
        }),
        [hour.getTime(), itemId, entered]
    );

    React.useEffect(() => {
        drag(myRef.current);
        drop(myRef.current);
    }, [myRef.current]);

    return (
        <MyDiv
            style={{ gridArea, zIndex: 1 }}
            onDragEnter={() => setEntered(true)}
            ref={myRef}
            {...rest}
        />
    );
};

export default EmptyItem;

//const shouldDispatchSetSendParam()
