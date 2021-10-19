import * as React from "react";
import { Table, Paper } from "@mui/material";
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
        cells: [42, -1, 80],
        getId: (a) => a,
    },
    y: {
        cells: [66, 111, 555],
        getId: (a) => a,
    },
};

const DragOnFieldsGrid = () => {
    const itemsOnGrid: ItemOnGrid<number, number>[] = [];
    for (let x = 0; x < 3; ++x) {
        for (let y = 0; y < 3; ++y) {
            itemsOnGrid.push({
                children: <DragOnField idx={x * 3 + y} />,
                xStart: gridDefinition.x.cells[x],
                yStart: gridDefinition.y.cells[y],
            });
        }
    }

    return (
        <Paper style={{ padding: "1rem", width: "300px", height: "300px" }}>
            <GenericCssGrid
                items={itemsOnGrid}
                style={{
                    width: "100%",
                    height: "100%",
                    gap: "1em",
                }}
                {...gridDefinition}
            />
        </Paper>
    );
};

export default DragOnFieldsGrid;
