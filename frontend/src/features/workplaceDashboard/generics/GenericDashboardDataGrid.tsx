import * as React from "react";
import { GridColDef, GridRowParams, DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

export interface Props<Item> {
    useItemSelector: () => (state: RootState) => Item[];
    useColumnDefs: () => GridColDef[];
}

const GenericDashboardDataGrid = <Item extends unknown>({
    useItemSelector,
    useColumnDefs,
}: React.PropsWithChildren<Props<Item>>) => {
    const items = useSelector(useItemSelector());
    const colDefs = useColumnDefs();

    return <DataGrid columns={colDefs} rows={items} />;
};

GenericDashboardDataGrid.whyDidYouRender = {
    logOnDifferentValues: true,
    customName: "GenericDashboardDataGrid",
};

export default GenericDashboardDataGrid;
