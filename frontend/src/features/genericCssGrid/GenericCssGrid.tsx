import * as React from "react";
import { styled, Box } from "@mui/material";

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
    gap?: string | number;
}

interface GenericCssGridContextValueType<Tx, Ty> {
    getIdX: (a: Tx) => string | number;
    getIdY: (a: Ty) => string | number;
    inverse: boolean;
}

const initalValue = {
    getIdX: () => {
        throw "GenericCssGridContext(): inital vlaue getIdX used!";
    },
    getIdY: () => {
        throw "GenericCssGridContext(): inital vlaue getIdY used!";
    },
    inverse: false,
};

const GenericCssGridContext =
    React.createContext<GenericCssGridContextValueType<any, any>>(initalValue);

const GenericCssGrid = <Tx, Ty>({
    x,
    y,
    additionalRows,
    additionalCols,
    children,
    gap,
}: React.PropsWithChildren<Props<Tx, Ty>>) => {
    const gridArea = React.useMemo(
        () => ({
            ...generateCssForGrid(
                { x, y },
                additionalRows,
                additionalCols,
                false
            ),
            gap,
        }),
        [x, y, additionalRows, additionalCols, gap]
    );

    return (
        <GenericCssGridContext.Provider
            value={{
                getIdX: x.getId,
                getIdY: y.getId,
                inverse: false,
            }}
        >
            <Box style={gridArea}>{children}</Box>
        </GenericCssGridContext.Provider>
    );
};

export default React.memo(GenericCssGrid) as typeof GenericCssGrid;

GenericCssGrid.whyDidYouRender = true;

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
    additionalCols: string[],
    inverse: boolean
): React.ComponentProps<"div">["style"] {
    const rowCssArray = [
        ...generateDimensionArrayForStrings(
            "row",
            !inverse ? additionalRows : additionalCols
        ),
        ...generateDimensionArray(
            "row",
            !inverse ? definition.y : (definition.x as any)
        ),
    ];
    const colCssArray = [
        ...generateDimensionArrayForStrings(
            "col",
            !inverse ? additionalCols : additionalRows
        ),
        ...generateDimensionArray(
            "col",
            !inverse ? definition.x : (definition.y as any)
        ),
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

interface GridAreaImplArg<Tx, Ty> extends GridAreaArg<Tx, Ty> {
    getIdX: (a: Tx) => number | string;
    getIdY: (a: Ty) => number | string;
    inverse: boolean;
}

const gridAreaImpl = <Tx, Ty>({
    xStart,
    yStart,
    xEnd,
    yEnd,
    getIdX,
    getIdY,
    inverse,
}: GridAreaImplArg<Tx, Ty>) => {
    const xEndText = xEnd ? `col-${getIdX(xEnd)}` : "span 1";
    const yEndText = yEnd ? `row-${getIdY(yEnd)}` : "span 1";

    return `row-${getIdY(yStart)} / col-${getIdX(
        xStart
    )} / ${yEndText} / ${xEndText}`;
};

export const useGridArea = <Tx, Ty>(args: GridAreaArg<Tx, Ty>) => {
    const { getIdX, getIdY, inverse } = React.useContext(GenericCssGridContext);

    return gridAreaImpl({ ...args, inverse, getIdX, getIdY });
};

export const useGridAreaMemo = <Tx, Ty>(
    args: GridAreaArg<Tx, Ty>,
    deps: React.DependencyList
) => {
    const { getIdX, getIdY, inverse } = React.useContext(GenericCssGridContext);

    return React.useMemo(
        () => gridAreaImpl({ ...args, inverse, getIdX, getIdY }),
        deps
    );
};

interface GridColumnArg<Tx> {
    xStart: Tx;
    yStart: string;
    xEnd?: Tx;
    yEnd?: string;
}

export const useGridColumn = <Tx extends unknown>(args: GridColumnArg<Tx>) => {
    const { getIdX, inverse } = React.useContext(GenericCssGridContext);

    return gridAreaImpl({ ...args, inverse, getIdX, getIdY: (a) => a });
};

interface GridRowArg<Ty> {
    xStart: string;
    yStart: Ty;
    xEnd?: string;
    yEnd?: Ty;
}

export const useGridRow = <Ty extends unknown>(args: GridRowArg<Ty>) => {
    const { getIdY, inverse } = React.useContext(GenericCssGridContext);

    return gridAreaImpl({ ...args, inverse, getIdX: (a) => a, getIdY });
};

interface GridCornerArg {
    xStart: string;
    yStart: string;
    xEnd?: string;
    yEnd?: string;
}

export const useGridCorner = (args: GridCornerArg) => {
    return gridAreaImpl({
        ...args,
        inverse: false,
        getIdX: (a) => a,
        getIdY: (a) => a,
    });
};

/**
 * Helper components
 */

interface DefaultItemOnGridBaseProps<Tx, Ty>
    extends React.ComponentProps<typeof Box> {
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;
    useGridAreaHook: (a: GridAreaArg<Tx, Ty>) => string;
}

const DefaultItemOnGridBase = <Tx, Ty>({
    xStart,
    yStart,
    xEnd,
    yEnd,
    style,
    children,
    useGridAreaHook,
    ...rest
}: React.PropsWithChildren<DefaultItemOnGridBaseProps<Tx, Ty>>) => {
    const gridArea = useGridAreaHook({ xStart, yStart, xEnd, yEnd });

    return (
        <Box style={{ ...style, gridArea }} {...rest}>
            {children}
        </Box>
    );
};

interface DefaultItemOnGridProps<Tx, Ty>
    extends React.ComponentProps<typeof Box> {
    xStart: Tx;
    yStart: Ty;
    xEnd?: Tx;
    yEnd?: Ty;
}

export const DefaultItemOnGrid = <Tx, Ty>(
    props: React.PropsWithChildren<DefaultItemOnGridProps<Tx, Ty>>
) => {
    return (
        <DefaultItemOnGridBase<Tx, Ty>
            {...props}
            useGridAreaHook={useGridArea}
        />
    );
};

type DefaultColumnItemOnGridProps<Tx> = DefaultItemOnGridProps<Tx, string>;

export const DefaultColumnItemOnGrid = <Tx extends unknown>(
    props: React.PropsWithChildren<DefaultColumnItemOnGridProps<Tx>>
) => {
    return (
        <DefaultItemOnGridBase<Tx, string>
            {...props}
            useGridAreaHook={useGridColumn}
        />
    );
};

type DefaultRowItemOnGridProps<Ty> = DefaultItemOnGridProps<string, Ty>;

export const DefaultRowItemOnGrid = <Ty extends unknown>(
    props: React.PropsWithChildren<DefaultRowItemOnGridProps<Ty>>
) => {
    return (
        <DefaultItemOnGridBase<string, Ty>
            {...props}
            useGridAreaHook={useGridRow}
        />
    );
};

const SimpleDiv = styled("div")({});
