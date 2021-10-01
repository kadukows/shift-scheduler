import * as React from "react";
import { Table, Paper } from "@material-ui/core";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

import DragOnField from "./DragOnField";
import GenericCssGrid, {
    ItemOnGrid,
    GridDefinition,
} from "../genericCssGrid/GenericCssGrid";

import "./style.css";

const gridDefinition: GridDefinition<number, number> = {
    x: {
        cells: [0, 1, 2],
        getId: (a) => a,
    },
    y: {
        cells: [0, 1, 2],
        getId: (a) => a,
    },
};

const DragOnFieldsGrid = () => {
    const itemsOnGrid: ItemOnGrid<number, number>[] = [];
    for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {
            itemsOnGrid.push({
                children: <DragOnField key={x * 3 + y} idx={x * 3 + y} />,
                xStart: x,
                yStart: y,
            });
        }
    }

    return (
        <Paper style={{ padding: "1rem", width: "300px", height: "300px" }}>
            <GenericCssGrid items={itemsOnGrid} {...gridDefinition} />
        </Paper>
    );
};

export default DragOnFieldsGrid;
