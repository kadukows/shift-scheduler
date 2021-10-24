import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useDrag, useDrop } from "react-dnd";

import { DndTypes, ItemPassed, getDndTypeForItemId } from "../DndTypes";
import {
    potentialNewShiftSetStart,
    potentationNewShiftReset,
    potentationNewShiftSetSendParam,
    potentationNewShiftSetItemId,
} from "../plannerByHoursSlice";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import { Role } from "../../../roles/rolesSlice";
import { Employee } from "../../../employees/employeeSlice";
import { BorderedDiv } from "./StyledDiv";
import { RootState } from "../../../../store";

interface Props<Item> extends React.ComponentProps<"div"> {
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
    style,
    ...rest
}: Props<Item>) => {
    const dispatch = useDispatch();
    const myRef = React.useRef();
    const gridArea = useGridArea<Date, Item>({ xStart: hour, yStart: item });
    const plannerByHourReducer = useSelector(
        (state: RootState) => state.plannerByHourReducer
    );

    const [{}, drag] = useDrag(
        () => ({
            type: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, item.id),
            item: (() => {
                dispatch(potentialNewShiftSetStart(hour.getTime()));
                dispatch(potentationNewShiftSetItemId(item.id));
                return { hour };
            }) as () => ItemPassed.EMPTY_ITEM_DRAG,
            end: () => dispatch(potentationNewShiftReset()),
        }),
        [hour, item]
    );

    const [{}, drop] = useDrop(
        () => ({
            accept: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, item.id),
            drop: ({ hour }: ItemPassed.EMPTY_ITEM_DRAG) =>
                alert(`Dropped from hour ${hour}`),
            hover: ({}: ItemPassed.EMPTY_ITEM_DRAG) => {
                const unixTime = hour.getTime();

                if (
                    plannerByHourReducer.potentialNewShift.start !== unixTime &&
                    plannerByHourReducer.potentialNewShift.end !== unixTime
                ) {
                    dispatch(potentationNewShiftSetSendParam(hour.getTime()));
                    console.log(`useDrop::hover(): setting hour: ${hour}`);
                }
            },
        }),
        [hour, item]
    );

    React.useEffect(() => {
        drag(myRef.current);
        drop(myRef.current);
    }, [myRef.current]);

    return <MyDiv style={{ ...style, gridArea }} {...rest} ref={myRef} />;
};

export default EmptyItem;

//const shouldDispatchSetSendParam()
