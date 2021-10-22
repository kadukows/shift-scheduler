import { styled } from "@mui/system";
import * as React from "react";

export interface ItemOnGrid<Tx, Ty> {
    children: React.ReactNode;
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;

    className?: string;
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
    additionalRows?: string[];
    additionalCols?: string[];
    additionalItems?: ItemOnGrid<string, string>[];
}

const GenericCssGrid = <Tx, Ty>({
    x,
    y,
    items,
    additionalRows,
    additionalCols,
    additionalItems,
    ...rest
}: Props<Tx, Ty>) => {
    const { style, ...restWoStyle } = rest;

    const newStyle = React.useMemo(
        () => ({
            ...generateCssForGrid({ x, y }, additionalRows, additionalCols),
            ...style,
        }),
        [x, y, style, additionalRows, additionalCols]
    );

    return (
        <div style={newStyle} {...restWoStyle}>
            {generateGridItems(items, x.getId, y.getId)}
            {generateGridItems(
                additionalItems,
                (a) => a,
                (a) => a
            )}
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
        result.push(`[${unique_key}-${def.getId(cell)}] auto`);
    }
    return result;
}

function generateDimensionArrayForStrings(unique_key: string, keys: string[]) {
    return keys ? keys.map((key) => `[${unique_key}-${key}] auto`) : [];
}

function generateCssForGrid<Tx, Ty>(
    definition: GridDefinition<Tx, Ty>,
    additionalRows: string[],
    additionalCols: string[]
): React.ComponentProps<"div">["style"] {
    const rowCssArray = [
        ...generateDimensionArrayForStrings("row", additionalRows),
        ...generateDimensionArray("row", definition.y),
    ];
    const colCssArray = [
        ...generateDimensionArrayForStrings("col", additionalCols),
        ...generateDimensionArray("col", definition.x),
    ];

    return {
        gridTemplateRows: rowCssArray.join(" "),
        gridTemplateColumns: colCssArray.join(" "),
        display: "grid",
    };
}

const GridItemDiv = styled("div")({
    width: "100%",
    height: "100%",
});

function generateGridItems<Tx, Ty>(
    items: Props<Tx, Ty>["items"],
    getIdX: (a: Tx) => string | number,
    getIdY: (a: Ty) => string | number
) {
    if (!items) {
        return [];
    }

    let key = 1;

    const transformItem = ({
        xStart,
        xEnd,
        yStart,
        yEnd,
        children,
        className,
    }: ItemOnGrid<Tx, Ty>) => {
        const gridArea = `row-${getIdY(yStart)} / col-${getIdX(xStart)} / ${
            yEnd ? `row-${getIdY(yEnd)}` : "span 1"
        } / ${xEnd ? `col-${getIdX(xEnd)}` : "span 1"}`;

        return (
            <GridItemDiv
                style={{
                    gridArea: gridArea,
                }}
                key={key++}
                className={className}
            >
                {children}
            </GridItemDiv>
        );
    };

    return items.map(transformItem);
}

export default GenericCssGrid;
