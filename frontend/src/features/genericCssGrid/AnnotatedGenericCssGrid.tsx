import * as React from "react";

import GenericCssGrid, {
    GridDefinition,
    ItemOnGrid,
    Props as GenericCssGridProps,
} from "./GenericCssGrid";

interface Props<Tx, Ty> extends GenericCssGridProps<Tx, Ty> {
    annotateX: (x: Tx) => React.ReactNode;
    annotateY: (y: Ty) => React.ReactNode;
}

const ANNOTATION_TYPE = "ANNOTATION_TYPE";

interface AnnotationCell {
    type: "ANNOTATION_TYPE";
}

const AnnotatedGenericCssGrid = <Tx, Ty>({
    x,
    y,
    items,
    annotateX,
    annotateY,
    ...rest
}: Props<Tx, Ty>) => {
    const annotationCell: AnnotationCell = { type: "ANNOTATION_TYPE" };
    const annotatedCellsX = [annotationCell, ...x.cells];
    const annotatedCellsY = [annotationCell, ...y.cells];

    const getIdX = (val: Tx | AnnotationCell) => {
        if (
            typeof val === "object" &&
            "type" in val &&
            val.type === "ANNOTATION_TYPE"
        ) {
            return "annotation";
        } else {
            return x.getId(val as Tx);
        }
    };

    const getIdY = (val: Ty | AnnotationCell) => {
        if (
            typeof val === "object" &&
            "type" in val &&
            val.type === "ANNOTATION_TYPE"
        ) {
            return "annotation";
        } else {
            return y.getId(val as Ty);
        }
    };

    const itemsOnGrid: ItemOnGrid<Tx | AnnotationCell, Ty | AnnotationCell>[] =
        [...items];

    for (const xCell of x.cells) {
        itemsOnGrid.push({
            children: annotateX(xCell),
            xStart: xCell,
            yStart: annotationCell,
        });
    }

    for (const yCell of y.cells) {
        itemsOnGrid.push({
            children: annotateY(yCell),
            xStart: annotationCell,
            yStart: yCell,
        });
    }

    const gridDefinition: GridDefinition<
        Tx | AnnotationCell,
        Ty | AnnotationCell
    > = {
        x: {
            cells: annotatedCellsX,
            getId: getIdX,
        },
        y: {
            cells: annotatedCellsY,
            getId: getIdY,
        },
    };

    return (
        <GenericCssGrid<Tx | AnnotationCell, Ty | AnnotationCell>
            items={itemsOnGrid}
            {...gridDefinition}
            {...rest}
        />
    );
};

export default AnnotatedGenericCssGrid;
