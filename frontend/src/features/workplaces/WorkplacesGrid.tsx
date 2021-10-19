import * as React from "react";
import { useSelector } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import {
    DataGrid,
    GridCellValue,
    GridColDef,
    GridToolbar,
    GridValueFormatterParams,
} from "@mui/x-data-grid";

import { workplaceSelectors } from "../workplaces/workplaceSlice";
import { RootState } from "../../store";

const columns: GridColDef[] = [
    { field: "id", minWidth: 90, flex: 0 },
    {
        field: "name",
        minWidth: 150,
        flex: 1,
        editable: true,
    },
    /*
    {
        field: "last_modified",
        minWidth: 150,
        flex: 1,
        type: "dateTime",
        valueFormatter: (params: GridValueFormatterParams) => {
            return new Date(params.value as string).toTimeString();
        },
        valueParser: (value: GridCellValue) =>
            new Date(value.toString()).toISOString(),
    },
    */
];

const WorkplacesGrid = () => {
    //const workplaces = useSelector((state: RootState) => state.workplaceReducer.entities)
    //    .map(el => el)
    const workplaces = useSelector(workplaceSelectors.selectAll);

    return (
        <div style={{ width: "100%", height: 400 }}>
            <DataGrid
                rows={workplaces}
                columns={columns}
                pageSize={3}
                rowsPerPageOptions={[3, 5]}
                checkboxSelection
                components={{
                    Toolbar: GridToolbar,
                }}
                componentsProps={{
                    toolbar: {
                        color: "secondary",
                    } as React.ComponentProps<typeof GridToolbar>,
                }}
            />
        </div>
    );
};

export default WorkplacesGrid;
