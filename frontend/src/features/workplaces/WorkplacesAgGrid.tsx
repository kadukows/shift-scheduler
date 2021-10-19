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
} from "@mui/material";
import { AgGridColumn, AgGridReact } from "ag-grid-react";

import { workplaceSelectors } from "../workplaces/workplaceSlice";
import { RootState } from "../../store";
import WorkplaceForm from "./WorkplaceForm";

import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";
import "ag-grid-community/dist/styles/ag-theme-alpine-dark.css";
import "ag-grid-community/dist/styles/ag-theme-material.css";

function btnRenderer(props: any) {
    return (
        <Button
            style={{ padding: 8 }}
            color="primary"
            onClick={() => props.onClick(props.value)}
        >
            {props.name}
        </Button>
    );
}

interface Props {
    onClickCellDeletion: (id: number) => void;
    onClickCellUpdate: (id: number) => void;
}

const WorkplacesAgGrid = ({
    onClickCellDeletion,
    onClickCellUpdate,
}: Props) => {
    const workplaces = useSelector(workplaceSelectors.selectAll);
    const theme = useTheme();

    const agGridClass =
        theme.palette.mode === "dark"
            ? "ag-theme-alpine-dark"
            : "ag-theme-alpine";

    return (
        <>
            <div
                className={agGridClass}
                style={{ minHeight: 50, width: "100%", overflow: "hidden" }}
            >
                <AgGridReact
                    rowData={workplaces}
                    rowSelection="multiple"
                    pagination
                    paginationPageSize={10}
                    domLayout="autoHeight"
                    frameworkComponents={{
                        btnRenderer,
                    }}
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
                    <AgGridColumn
                        flex={1}
                        headerName="Update"
                        field="id"
                        cellRenderer="btnRenderer"
                        cellRendererParams={{
                            onClick: onClickCellUpdate,
                            name: "Update",
                        }}
                    />
                    <AgGridColumn
                        flex={1}
                        headerName="Delete"
                        field="id"
                        cellRenderer="btnRenderer"
                        cellRendererParams={{
                            onClick: onClickCellDeletion,
                            name: "Delete",
                        }}
                    />
                </AgGridReact>
            </div>
        </>
    );
};

export default WorkplacesAgGrid;
