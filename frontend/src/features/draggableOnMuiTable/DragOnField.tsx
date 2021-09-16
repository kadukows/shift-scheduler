import * as React from "react";
import { useDrop } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { ItemTypes, ItemTypesPassed } from "../dndTypes/DndTypes";

import { setDraggable, removeDraggable } from "./draggableThingsSlice";

interface Props {
    idx: number;
}

const DragOnField = ({ idx }: Props) => {
    const dispatch = useDispatch();
    const draggableState = useSelector(
        (state: RootState) => state.draggableThingsReducer
    );
    const [{ somethingHovers }, drop] = useDrop(() => ({
        accept: ItemTypes.COLORSQUARE,
        collect: (monitor) => ({
            somethingHovers: monitor.isOver(),
        }),
        drop: (item: ItemTypesPassed.COLORSQUARE, monitor) => {
            dispatch(setDraggable({ idx, square: item }));
        },
    }));

    const square = draggableState.squares[idx];

    const clicked = () => {
        if (square) {
            dispatch(removeDraggable(idx));
        }
    };

    const style = {
        width: "100%",
        height: "100%",
        backgroundColor: square ? square.color : "lightgray",
        border: "1px solid black",
    };

    return (
        <div style={style} onClick={clicked} ref={drop}>
            {somethingHovers && (
                <div
                    style={{
                        zIndex: 1,
                        backgroundColor: "yellow",
                        width: "100%",
                        height: "100%",
                    }}
                />
            )}
        </div>
    );
};

export default DragOnField;
