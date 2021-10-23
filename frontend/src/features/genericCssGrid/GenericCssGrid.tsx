import { styled } from "@mui/system";
import * as React from "react";

export interface GridDimensionDefinition<Cell> {
    cells: Cell[];
    getId: (a: Cell) => string | number;
}

const unpackGridDimensionDefinition = <Cell extends unknown>(
    def: GridDimensionDefinition<Cell>
) => {
    return def.cells.map(def.getId);
};

export interface GridDefinition<Tx, Ty> {
    x: GridDimensionDefinition<Tx>;
    y: GridDimensionDefinition<Ty>;
}

export interface Props<Tx, Ty>
    extends GridDefinition<Tx, Ty>,
        React.ComponentProps<"div"> {
    additionalRows?: string[];
    additionalCols?: string[];
}

interface GenericCssGridContextValueType<Tx, Ty> {
    getIdX: (a: Tx) => string | number;
    getIdY: (a: Ty) => string | number;
}

const initalValue = {
    getIdX: () => {
        throw "GenericCssGridContext(): inital vlaue getIdX used!";
    },
    getIdY: () => {
        throw "GenericCssGridContext(): inital vlaue getIdY used!";
    },
};

const GenericCssGridContext =
    React.createContext<GenericCssGridContextValueType<any, any>>(initalValue);

const GenericCssGrid = <Tx, Ty>({
    x,
    y,
    additionalRows,
    additionalCols,
    children,
    ...rest
}: React.PropsWithChildren<Props<Tx, Ty>>) => {
    const { style, ...restWoStyle } = rest;

    const gridArea = React.useMemo(
        () => generateCssForGrid({ x, y }, additionalRows, additionalCols),
        [
            ...unpackGridDimensionDefinition(x),
            ...unpackGridDimensionDefinition(y),
            additionalRows,
            additionalCols,
        ]
    );

    return (
        <GenericCssGridContext.Provider
            value={{ getIdX: x.getId, getIdY: y.getId }}
        >
            <div style={{ ...gridArea, ...style }} {...restWoStyle}>
                {children}
            </div>
        </GenericCssGridContext.Provider>
    );
};

export default GenericCssGrid;

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

/**
 *
 */

interface GridAreaArg<Tx, Ty> {
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;
}

export const useGridArea = <Tx, Ty>({
    xStart,
    yStart,
    xEnd,
    yEnd,
}: GridAreaArg<Tx, Ty>) => {
    const context = React.useContext(GenericCssGridContext);

    const xEndText = xEnd ? `col-${context.getIdX(xEnd)}` : "span 1";
    const yEndText = yEnd ? `col-${context.getIdY(yEnd)}` : "span 1";

    return `row-${context.getIdY(yStart)} / col-${context.getIdX(
        xStart
    )} / ${xEndText} / ${yEndText}`;
};

interface GridColumnArg<Tx> {
    xStart: Tx;
    yStart: string;
    xEnd?: Tx;
    yEnd?: string;
}

export const useGridColumn = <Tx extends unknown>({
    xStart,
    yStart,
    xEnd,
    yEnd,
}: GridColumnArg<Tx>) => {
    const context = React.useContext(GenericCssGridContext);

    const xEndText = xEnd ? `col-${context.getIdX(xEnd)}` : "span 1";
    const yEndText = yEnd ? `row-${yEnd}` : "span 1";

    return `row-${yStart} / col-${context.getIdX(
        xStart
    )} / ${yEndText} / ${xEndText}`;
};

interface GridRowArg<Ty> {
    xStart: string;
    yStart: Ty;
    xEnd?: string;
    yEnd?: Ty;
}

export const useGridRow = <Ty extends unknown>({
    xStart,
    yStart,
    xEnd,
    yEnd,
}: GridRowArg<Ty>) => {
    const context: GenericCssGridContextValueType<any, Ty> = React.useContext(
        GenericCssGridContext
    );

    const xEndText = xEnd ? `col-${xEnd}` : "span 1";
    const yEndText = yEnd ? `row-${context.getIdY(yEnd)}` : "span 1";

    return `row-${context.getIdY(
        yStart
    )} / col-${xStart} / ${yEndText} / ${xEndText}`;
};

/**
 *
 */

interface DefaultItemOnGridProps<Tx, Ty> extends React.ComponentProps<"div"> {
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;
}

export const DefaultItemOnGrid = <Tx, Ty>({
    xStart,
    yStart,
    xEnd,
    yEnd,
    style,
    children,
    ...rest
}: React.PropsWithChildren<DefaultItemOnGridProps<Tx, Ty>>) => {
    const gridArea = useGridArea<Tx, Ty>({ xStart, yStart, xEnd, yEnd });

    return (
        <div style={{ ...style, gridArea }} {...rest}>
            {children}
        </div>
    );
};
