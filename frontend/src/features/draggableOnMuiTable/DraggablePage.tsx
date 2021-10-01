import * as React from "react";
import { Grid } from "@material-ui/core";

import DraggableThingsDrawer from "./DraggableThingsDrawer";
import DragOnFieldsGrid from "./DragOnFieldsTable";

const DraggablePage = () => {
    return (
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
    );
};

export default DraggablePage;
