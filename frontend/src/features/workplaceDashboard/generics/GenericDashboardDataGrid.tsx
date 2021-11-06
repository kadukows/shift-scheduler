import * as React from "react";
import { GridColDef, GridRowParams, DataGrid } from "@mui/x-data-grid";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { useSignal } from "../../eventProvider/EventProvider";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";

interface Props<Item> {
    itemSelector: (workplaceId: number) => (state: RootState) => Item[];
    updateEvent: string;
    makeColumnDefs: (signalFunc: SignalFuncType) => GridColDef[];
    //DivProps?: React.ComponentProps<"div">;
    DivComponent: React.ComponentType<React.ComponentProps<"div">>;
}

const GenericDashboardDataGrid = <Item extends unknown>({
    itemSelector,
    updateEvent,
    makeColumnDefs,
    DivComponent,
}: React.PropsWithChildren<Props<Item>>) => {
    const workplaceId = useWorkplaceId();
    const items = useSelector(itemSelector(workplaceId));
    const updateSignal = useSignal(updateEvent);

    const colDefs = React.useMemo(
        () => makeColumnDefs(updateSignal),
        [updateSignal, makeColumnDefs]
    );

    return (
        <DivComponent>
            <DataGrid columns={colDefs} rows={items} />
        </DivComponent>
    );
};

export default GenericDashboardDataGrid;

/**
 *
 */

type SignalFuncType = (...a: any[]) => void;
