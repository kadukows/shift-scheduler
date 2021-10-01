import { RowCtrl } from "ag-grid-community";
import * as React from "react";

export interface ItemOnGrid<Tx, Ty> {
    children: React.ReactNode;
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;
}

export interface GridDimensionDefinition<Cell> {
    cells: Cell[];
    getId: (a: Cell) => string | number;
}

export interface GridDefinition<Tx, Ty> {
    x: GridDimensionDefinition<Tx>;
    y: GridDimensionDefinition<Ty>;
}

interface Props<Tx, Ty> extends GridDefinition<Tx, Ty> {
    items: ItemOnGrid<Tx, Ty>[];
}

const GenericCssGrid = <Tx, Ty>({ x, y, items }: Props<Tx, Ty>) => {
    const css = generateCssForGrid({ x, y });

    return <div style={css}>{generateGridItems(items, x.getId, y.getId)}</div>;
};

function generateDimensionArray<T>(
    unique_key: string,
    def: GridDimensionDefinition<T>
) {
    const result = [];
    for (const cell of def.cells) {
        result.push(`[${unique_key}-${def.getId(cell)}] 1fr`);
    }

    return result;
}

function generateCssForGrid<Tx, Ty>(definition: GridDefinition<Tx, Ty>) {
    const rowCssArray = generateDimensionArray("row", definition.y);
    const colCssArray = generateDimensionArray("col", definition.x);

    return {
        gridTemplateRows: rowCssArray.join(" "),
        gridTemplateColumns: colCssArray.join(" "),
        display: "grid",
        width: "100%",
        height: "100%",
        flexGrow: 1,
    };
}

function generateGridItems<Tx, Ty>(
    items: Props<Tx, Ty>["items"],
    getIdX: (a: Tx) => string | number,
    getIdY: (a: Ty) => string | number
) {
    let key = 1;

    const transformItem = ({
        xStart,
        xEnd,
        yStart,
        yEnd,
        children,
    }: ItemOnGrid<Tx, Ty>) => {
        const gridArea = `${getIdY(yStart)} / ${getIdX(xStart)} / ${
            yEnd ? getIdY(yEnd) : "span 1"
        } / ${xEnd ? getIdX(xEnd) : "span 1"}`;

        console.log(gridArea);

        return (
            <div
                style={{
                    gridArea: gridArea,
                    width: "100%",
                    height: "100%",
                }}
                key={key++}
            >
                {children}
            </div>
        );
    };

    return items.map(transformItem);
}

export default GenericCssGrid;
