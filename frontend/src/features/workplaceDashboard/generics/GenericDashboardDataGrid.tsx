import * as React from "react";
import { GridColDef, GridRowParams, DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useSignal } from "../../eventProvider/EventProvider";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { styled } from "@mui/material";

export interface Props<Item> {
    itemSelector: (workplaceId: number) => (state: RootState) => Item[];
    updateEvent: string;
    useColumnDefs: (signalFunc: SignalFuncType) => GridColDef[];
}

const MyDiv = styled("div")({
    width: "100%",
    height: 350,
});

const GenericDashboardDataGrid = <Item extends unknown>({
    itemSelector,
    updateEvent,
    useColumnDefs,
}: React.PropsWithChildren<Props<Item>>) => {
    const workplaceId = useWorkplaceId();
    const items = useSelector(itemSelector(workplaceId));
    const updateSignal = useSignal(updateEvent);

    const colDefs = useColumnDefs(updateSignal);

    return (
        <MyDiv>
            <DataGrid columns={colDefs} rows={items} />
        </MyDiv>
    );
};

GenericDashboardDataGrid.whyDidYouRender = {
    logOnDifferentValues: true,
    customName: "GenericDashboardDataGrid",
};

export default GenericDashboardDataGrid;

/**
 *
 */

type SignalFuncType = (...a: any[]) => void;
