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
    DivProps?: React.ComponentProps<"div">;
}

const GenericDashboardDataGrid = <Item extends unknown>({
    itemSelector,
    updateEvent,
    makeColumnDefs,
    DivProps,
}: React.PropsWithChildren<Props<Item>>) => {
    const workplaceId = useWorkplaceId();
    const items = useSelector(itemSelector(workplaceId));
    const updateSignal = useSignal(updateEvent);

    const colDefs = React.useMemo(
        () => makeColumnDefs(updateSignal),
        [updateSignal]
    );

    return (
        <div {...DivProps}>
            <DataGrid columns={colDefs} rows={items} />
        </div>
    );
};

export default GenericDashboardDataGrid;

/**
 *
 */

type SignalFuncType = (...a: any[]) => void;
