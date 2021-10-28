import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { DropTargetMonitor, useDrag, useDrop, XYCoord } from "react-dnd";
import { addHours, compareAsc, getTime, format } from "date-fns";

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
import { asyncUpdateShift } from "../../../shifts/helpers";
import { Shift } from "../../../shifts/shiftSlice";
import {
    startBatching,
    stopBatchin,
    useBatchedDispatch,
    useBatchingContext,
} from "../../../dispatchBatcher/DispatchBatcherProvider";

interface Props {
    hour: Date;
    itemId: number;
    getShiftComplementaryFromItemId: (itemId: number) => Partial<Shift>;
}

export const MyDiv = styled(BorderedDiv)({
    backgroundColor: "rgba(128, 128, 128, 0)",
    ":hover": {
        backgroundColor: "rgba(128, 128, 128, 0.2)",
    },
});

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";

const EmptyItem = <Item extends Role | Employee>({
    hour,
    itemId,
    getShiftComplementaryFromItemId,
    ...rest
}: Props) => {
    const myRef = React.useRef();
    const entered = React.useRef(false);
    const gridArea = useGridAreaMemo({ xStart: hour, yStart: { id: itemId } }, [
        hour.getTime(),
        itemId,
    ]);
    const dispatch = useDispatch();
    const batchedDispatch = useBatchedDispatch();
    const batchingContext = useBatchingContext();

    const [{}, drag] = useDrag(
        () => ({
            type: getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId),
            item: { itemId, hour: hour.getTime() },
            end: () => {
                batchedDispatch(reset());
                stopBatchin(batchingContext, dispatch);
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
            drop: (
                itemAny:
                    | ItemPassed.EMPTY_ITEM_DRAG
                    | ItemPassed.SHIFT_ITEM_DRAG,
                monitor
            ) => {
                if (
                    monitor.getItemType() ===
                    getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId)
                ) {
                    const item = itemAny as ItemPassed.EMPTY_ITEM_DRAG;

                    const [start, end] = sort2Dates(item.hour, hour.getTime());

                    dispatch(
                        addDialogSet({
                            start: getTime(start),
                            end: addHours(end, 1).getTime(),
                            secondIndexItemId: item.itemId,
                            open: true,
                        })
                    );
                } else if (monitor.getItemType() == DndTypes.SHIFT_ITEM_DRAG) {
                    const {
                        shiftTimeFrom,
                        shiftTimeTo,
                        width,
                        height,
                        shiftId,
                    } = itemAny as ItemPassed.SHIFT_ITEM_DRAG;

                    const { start, end } = getStartEndForHoveredSecondIndexItem(
                        monitor,
                        width,
                        height,
                        shiftTimeFrom,
                        shiftTimeTo,
                        hour.getTime()
                    );

                    dispatch(
                        asyncUpdateShift({
                            id: shiftId,
                            changes: {
                                time_from: format(start, TIME_FORMAT),
                                time_to: format(end, TIME_FORMAT),
                                ...getShiftComplementaryFromItemId(itemId),
                            },
                        })
                    );
                }
            },
            hover: (itemAny, monitor) => {
                if (entered.current) {
                    if (
                        monitor.getItemType() ===
                        getDndTypeForItemId(DndTypes.EMPTY_ITEM_DRAG, itemId)
                    ) {
                        const item = itemAny as ItemPassed.EMPTY_ITEM_DRAG;

                        const startOffset =
                            compareAsc(item.hour, hour) === 1 ? 1 : 0;
                        const endOffset =
                            compareAsc(item.hour, hour) === -1 ? 1 : 0;

                        console.log("batchedDisptach()");

                        batchedDispatch(
                            set({
                                start: addHours(
                                    item.hour,
                                    startOffset
                                ).getTime(),
                                end: addHours(hour, endOffset).getTime(),
                                secondIndexItemId: item.itemId,
                            })
                        );
                    } else if (
                        monitor.getItemType() === DndTypes.SHIFT_ITEM_DRAG
                    ) {
                        const { shiftTimeFrom, shiftTimeTo, width, height } =
                            itemAny as ItemPassed.SHIFT_ITEM_DRAG;

                        batchedDispatch(
                            set({
                                ...getStartEndForHoveredSecondIndexItem(
                                    monitor,
                                    width,
                                    height,
                                    shiftTimeFrom,
                                    shiftTimeTo,
                                    hour.getTime()
                                ),
                                secondIndexItemId: itemId,
                            })
                        );
                    }

                    entered.current = false;
                }
            },
        }),
        [hour.getTime(), itemId, getShiftComplementaryFromItemId]
    );

    React.useEffect(() => {
        drag(myRef.current);
        drop(myRef.current);
    }, [myRef.current]);

    return (
        <MyDiv
            style={{ gridArea, zIndex: 1 }}
            onDragEnter={() => {
                entered.current = true;
            }}
            onDragStart={() => startBatching(batchingContext, dispatch)}
            ref={myRef}
            {...rest}
        />
    );
};

export default EmptyItem;

const sort2Dates = (lhs: Date | number, rhs: Date | number) =>
    compareAsc(lhs, rhs) === -1 ? [lhs, rhs] : [rhs, lhs];

const vecDifference = (lhs: XYCoord, rhs: XYCoord) => ({
    x: lhs.x - rhs.x,
    y: lhs.y - rhs.y,
});

const vecNormalize = (lhs: XYCoord, widthHeight: XYCoord) => ({
    x: lhs.x / widthHeight.x,
    y: lhs.y / widthHeight.y,
});

const getStartEndForHoveredSecondIndexItem = (
    monitor: DropTargetMonitor,
    width: number,
    height: number,
    timeFrom: number,
    timeTo: number,
    msRootTime: number
) => {
    const temp = { x: width, y: height };

    const normalized = vecNormalize(
        vecDifference(
            monitor.getInitialClientOffset(),
            monitor.getInitialSourceClientOffset()
        ),
        temp
    );

    const length = timeTo - timeFrom;

    return {
        start: addHours(msRootTime - length * normalized.x, 1).getTime(),
        end: addHours(msRootTime + length * (1 - normalized.x), 1).getTime(),
    };
};
