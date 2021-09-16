import * as React from "react";
import { Grid } from "@material-ui/core";

import DraggableThingsDrawer from "./DraggableThingsDrawer";
import DraggableMuiTable from "./DraggableMuiTable";

const DraggablePage = () => {
    return (
        <Grid container spacing={2} justifyContent="space-around">
            <Grid item>
                <DraggableThingsDrawer />
            </Grid>
            <Grid item>
                <DraggableMuiTable />
            </Grid>
        </Grid>
    );
};

export default DraggablePage;
