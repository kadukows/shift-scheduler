import * as React from "react";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { useDrag } from "react-dnd";
import { RootState } from "../../../../../store";
import {
    Employee,
    employeeSelectors,
} from "../../../../employees/employeeSlice";
import { useGridAreaMemo } from "../../../../genericCssGrid/GenericCssGrid";
import { Role, roleSelectors } from "../../../../roles/rolesSlice";
import { Shift, shiftSelectors } from "../../../../shifts/shiftSlice";
import { set as updateDialogSet } from "../../../dialogs/updateDialogSlice";
import { reset as potentialNewItemReset } from "../../potentialNewItemSlice";
import { HoverableDiv, PlannerByHoursSecondItemDiv } from "../StyledDiv";
import { DndTypes, ItemPassed } from "../../DndTypes";
import {
    startBatching,
    stopBatchin,
    useBatchedDispatch,
    useBatchingContext,
} from "../../../../dispatchBatcher/DispatchBatcherProvider";
import {
    asyncAddShiftCopy,
    asyncUpdateShift,
} from "../../../../shifts/helpers";

interface Props<SecondIndex> {
    shiftId: number;
    getSecondIndex: (employee: Employee, role: Role) => SecondIndex;
    getNodeDesc: (employee: Employee, role: Role) => string;
}

const TIME_FORMAT = "yyyy-MM-dd'T'HH:mmX";

const GenericSecondIndexItem = <SecondIndex extends { id: number }>({
    shiftId,
    getSecondIndex,
    getNodeDesc,
}: Props<SecondIndex>) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, shift.role)
    );

    const employee = useSelector((state: RootState) =>
        employeeSelectors.selectById(state, shift.employee)
    );

    const secondIndex = getSecondIndex(employee, role);

    const gridArea = useGridAreaMemo<Date, SecondIndex>(
        {
            xStart: new Date(shift.time_from),
            xEnd: new Date(shift.time_to),
            yStart: secondIndex,
        },
        [shiftId, secondIndex.id, shift.time_from, shift.time_to]
    );

    const dispatch = useDispatch();
    const batchedDispatch = useBatchedDispatch();
    const batchingContext = useBatchingContext();

    const heightWidth = React.useRef({ w: 0, h: 0 });

    const [{}, drag] = useDrag<ItemPassed.SHIFT_ITEM_DRAG, unknown, unknown>(
        () => ({
            type: DndTypes.SHIFT_ITEM_DRAG,
            item: () => ({
                shiftId: shiftId,
                shiftTimeFrom: new Date(shift.time_from).getTime(),
                shiftTimeTo: new Date(shift.time_to).getTime(),
                width: heightWidth.current.w,
                height: heightWidth.current.h,
            }),
            canDrag: () => {
                return !shift.blocked;
            },
            end: (item, monitor) => {
                const dropResult: DropResult = monitor.getDropResult();

                if (dropResult) {
                    const {
                        start,
                        end,
                        getShiftComplementaryFromItemId,
                        dropEffect,
                        itemId,
                    } = dropResult;

                    if (dropEffect === "move") {
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
                    } else {
                        dispatch(
                            asyncAddShiftCopy({
                                id: shiftId,
                                changes: {
                                    time_from: format(start, TIME_FORMAT),
                                    time_to: format(end, TIME_FORMAT),
                                    ...getShiftComplementaryFromItemId(itemId),
                                },
                            })
                        );
                    }
                }

                batchedDispatch(potentialNewItemReset());
                stopBatchin(batchingContext, dispatch);
            },
        }),
        [shiftId, shift.time_from, shift.time_to, shift.blocked]
    );

    const myRef = React.useRef<any>();

    React.useEffect(() => {
        drag(myRef);

        heightWidth.current.h = myRef.current.clientHeight;
        heightWidth.current.w = myRef.current.clientWidth;
    }, [myRef.current]);

    const style: any = {};
    if (shift.blocked) {
        style.opacity = 0.7;
    }

    return (
        <HoverableDiv sx={{ p: 0.7 }} style={{ gridArea }}>
            <PlannerByHoursSecondItemDiv
                onClick={() => {
                    if (!shift.blocked) {
                        dispatch(updateDialogSet({ shiftId, open: true }));
                    }
                }}
                ref={myRef}
                style={style}
                onDragStart={() => startBatching(batchingContext, dispatch)}
            >
                <Typography noWrap>
                    {getNodeDesc(employee, role)}
                    <br />
                    {format(Date.parse(shift.time_from), "HH:mm")}
                    --
                    {format(Date.parse(shift.time_to), "HH:mm")}
                </Typography>
            </PlannerByHoursSecondItemDiv>
        </HoverableDiv>
    );
};

export default GenericSecondIndexItem;

interface DropResult {
    start: number;
    end: number;
    dropEffect: "move" | "copy";
    getShiftComplementaryFromItemId: (a: number) => Partial<Shift>;
    itemId: number;
}
