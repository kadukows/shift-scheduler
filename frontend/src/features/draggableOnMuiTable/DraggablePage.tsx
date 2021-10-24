import * as React from "react";
import { Grid, Typography } from "@mui/material";

import DraggableThingsDrawer from "./DraggableThingsDrawer";
import DragOnFieldsGrid from "./DragOnFieldsTable";

import GenericCssGrid, {
    GridDefinition,
} from "../genericCssGrid/GenericCssGrid";
import AnnotatedGenericCssGrid from "../genericCssGrid/AnnotatedGenericCssGrid";

const xList: number[] = [2, 0, 5];
const yList: number[] = [1005, 1001, 1000];

const gridDefinition: GridDefinition<number, number> = {
    x: {
        cells: xList,
        getId: (a) => a,
    },
    y: {
        cells: yList,
        getId: (a) => a,
    },
};

const DraggablePage = () => {
    /*
    const itemsOnGrid: ItemOnGrid<number, number>[] = [];
    for (const x of xList) {
        for (const y of yList) {
            itemsOnGrid.push({
                children: `${x * y}`,
                xStart: x,
                yStart: y,
            });
        }
    }

    return (
        <>
            <Grid
                container
                spacing={2}
                justifyContent="space-around"
                alignContent="center"
            >
                <Grid item>
                    <DraggableThingsDrawer />
                </Grid>
                <Grid item>
                    <DragOnFieldsGrid />
                </Grid>
            </Grid>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <AnnotatedGenericCssGrid
                        items={itemsOnGrid}
                        annotateX={(x: number) => (
                            <Typography>{`Annotated x: ${x}`}</Typography>
                        )}
                        annotateY={(y: number) => `Annotated y: ${y}`}
                        {...gridDefinition}
                        style={{
                            gap: "1em",
                            width: "100%",
                            height: "100%",
                        }}
                    />
                </Grid>
            </Grid>
        </>
    );
    */
    return <div />;
};

export default DraggablePage;
