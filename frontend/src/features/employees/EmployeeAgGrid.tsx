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

import { employeeSelectors } from "./employeeSlice";
import { workplaceSelectors } from "../workplaces/workplaceSlice";

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

const EmployeeAgGrid = ({ onClickCellDeletion, onClickCellUpdate }: Props) => {
    const employees = useSelector(employeeSelectors.selectAll);
    const workplacesById = useSelector(workplaceSelectors.selectEntities);
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
                    rowData={employees}
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
                        sortable
                        filter
                        resizable={true}
                        flex={5}
                        valueGetter={(params) =>
                            `${params.data.first_name} ${params.data.last_name}`
                        }
                    ></AgGridColumn>
                    <AgGridColumn
                        sortable
                        filter
                        resizable={true}
                        flex={5}
                        valueGetter={(params) =>
                            workplacesById[params.data.workplace]?.name
                        }
                    />
                    <AgGridColumn
                        width={90}
                        headerName="Update"
                        field="id"
                        cellRenderer="btnRenderer"
                        cellRendererParams={{
                            onClick: onClickCellUpdate,
                            name: "Update",
                        }}
                    />
                    <AgGridColumn
                        width={90}
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

export default EmployeeAgGrid;
