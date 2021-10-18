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

export interface Props<Tx, Ty>
    extends GridDefinition<Tx, Ty>,
        React.ComponentProps<"div"> {
    items: ItemOnGrid<Tx, Ty>[];
}

const GenericCssGrid = <Tx, Ty>({ x, y, items, ...rest }: Props<Tx, Ty>) => {
    const { style, ...restWoStyle } = rest;

    const newStyle = React.useMemo(
        () => ({ ...generateCssForGrid({ x, y }), ...style }),
        [x, y, style]
    );

    return (
        <div style={newStyle} {...restWoStyle}>
            {generateGridItems(items, x.getId, y.getId)}
        </div>
    );
};

/**
 *
 */

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

function generateCssForGrid<Tx, Ty>(
    definition: GridDefinition<Tx, Ty>
): React.ComponentProps<"div">["style"] {
    const rowCssArray = generateDimensionArray("row", definition.y);
    const colCssArray = generateDimensionArray("col", definition.x);

    return {
        gridTemplateRows: rowCssArray.join(" "),
        gridTemplateColumns: colCssArray.join(" "),
        display: "grid",
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
        const gridArea = `row-${getIdY(yStart)} / col-${getIdX(xStart)} / ${
            yEnd ? `row-${getIdY(yEnd)}` : "span 1"
        } / ${xEnd ? `col-${getIdX(xEnd)}` : "span 1"}`;

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
