import * as React from "react";
import { useDrag } from "react-dnd";
import { useDispatch, useSelector } from "react-redux";
import { Paper } from "@mui/material";

import { RootState } from "../../store";
import { ItemTypes, ItemTypesPassed } from "../dndTypes/DndTypes";
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
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.COLORSQUARE,
        item: { color } as ItemTypesPassed.COLORSQUARE,
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    }));

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: color,
                border: "1px solid black",
                opacity: isDragging ? 0.4 : 1.0,
            }}
            ref={drag}
        />
    );
};

const DraggableThingsDrawer = () => {
    return (
        <Paper style={{ padding: "1rem" }}>
            <div className="drawer-container">
                <ColorSquare color="#0074D9" />
                <ColorSquare color="#85144b" />
                <ColorSquare color="#3D9970" />
            </div>
        </Paper>
    );
};

export default DraggableThingsDrawer;
