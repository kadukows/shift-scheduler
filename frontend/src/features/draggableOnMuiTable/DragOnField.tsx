import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";

import { setDraggable, removeDraggable } from "./draggableThingsSlice";

interface Props {
    idx: number;
}

const DragOnField = ({ idx }: Props) => {
    const dispatch = useDispatch();
    const draggableState = useSelector(
        (state: RootState) => state.draggableThingsReducer
    );

    const square = draggableState.squares[idx];

    const clicked = () => {
        if (square) {
            dispatch(removeDraggable(idx));
        } else {
            dispatch(
                setDraggable({
                    idx,
                    square: {
                        color: draggableState.chosenColor,
                    },
                })
            );
        }
    };

    const style = {
        width: "100%",
        height: "100%",
        backgroundColor: square ? square.color : "lightgray",
        border: "1px solid black",
    };

    return <div style={style} onClick={clicked}></div>;
};

export default DragOnField;
