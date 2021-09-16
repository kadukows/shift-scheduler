import * as React from "react";
import { useDrag } from "react-dnd";
import { ItemTypes } from "../dndTypes/DndTypes";

interface Props {}

const DraggableThing = ({}: Props) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.DRAGGABLETHING,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    return (
        <div
            ref={drag}
            style={{
                backgroundColor: "blueviolet",
                padding: "8px",
                width: "100%",
                height: "100%",
                opacity: isDragging ? 0.4 : 1.0,
            }}
        ></div>
    );
};

export default DraggableThing;
