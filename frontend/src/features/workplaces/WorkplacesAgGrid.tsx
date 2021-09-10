import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    Grid,
    Button,
    useTheme,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from "@material-ui/core";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import { workplaceSelectors } from "../workplaces/workplaceSlice";
import { RootState } from "../../store";
import WorkplaceForm from "./workplaceForm/WorkplaceForm";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

interface Props {
    gridRef: React.Ref<>;
}

const WorkplacesAgGrid = ({ gridRef }: Props) => {
    const workplaces = useSelector(workplaceSelectors.selectAll);
    const theme = useTheme();

    const agGridClass =
        theme.palette.type === "dark"
            ? "ag-theme-alpine-dark"
            : "ag-theme-alpine";

    return (
        <>
            <div
                className={agGridClass}
                style={{ minHeight: 50, width: "100%", overflow: "hidden" }}
            >
                <AgGridReact
                    ref={gridRef}
                    rowData={workplaces}
                    rowSelection="multiple"
                    pagination
                    paginationPageSize={10}
                    domLayout="autoHeight"
                    onGridReady={(params) => {}}
                >
                    <AgGridColumn
                        checkboxSelection
                        headerCheckboxSelection
                        width={50}
                    ></AgGridColumn>
                    <AgGridColumn field="id" width={50}></AgGridColumn>
                    <AgGridColumn
                        field="name"
                        sortable
                        filter
                        resizable={true}
                        flex={5}
                    ></AgGridColumn>
                </AgGridReact>
            </div>
        </>
    );
};

export default WorkplacesAgGrid;
