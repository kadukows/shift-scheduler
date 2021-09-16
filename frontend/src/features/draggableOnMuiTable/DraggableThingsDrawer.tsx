import * as React from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "../../store";
import { setChosenColor } from "./draggableThingsSlice";

const MyDiv = ({ style }: any) => (
    <div
        style={{
            width: "100%",
            height: "100%",
            ...style,
        }}
    />
);

interface ColorSquareProps {
    color: string;
}

const ColorSquare = ({ color }: ColorSquareProps) => {
    const dispatch = useDispatch();
    const selected =
        useSelector(
            (state: RootState) => state.draggableThingsReducer.chosenColor
        ) === color;

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: color,
                border: selected ? "3px solid yellow" : "3px dotted white",
            }}
            onClick={() => dispatch(setChosenColor(color))}
        />
    );
};

const DraggableThingsDrawer = () => {
    return (
        <div className="drawer-container">
            <ColorSquare color="#0074D9" />
            <ColorSquare color="#85144b" />
            <ColorSquare color="#3D9970" />
        </div>
    );
};

export default DraggableThingsDrawer;
