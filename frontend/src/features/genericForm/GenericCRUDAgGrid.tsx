import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import { RootState } from "../../store";

import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";

interface WithId {
    id: number;
}

interface Props<Entity> {
    entities: Entity[];
}

const GenericCRUDAgGrid = <Entity extends WithId>({
    entities,
}: React.PropsWithChildren<Props<Entity>>) => {
    const darkMode = useSelector(
        (state: RootState) => state.darkThemeProviderReducer.darkMode
    );

    const agGridClass = darkMode ? "ag-theme-alpine-dark" : "ag-theme-alpine";

    return (
        <div className={agGridClass}>
            <AgGridReact rowData={entities} />
        </div>
    );
};

export default GenericCRUDAgGrid;
