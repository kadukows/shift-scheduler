import * as React from "react";
import {
    DataGrid,
    GridRowParams,
    GridActionsCellItem,
    GridColDef,
    GridValueGetterParams,
    GridSortCellParams,
} from "@mui/x-data-grid";
import { Edit as EditIcon } from "@mui/icons-material";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { employeesByWorkplaceSelector } from "./employeeByWorkplaceSelector";
import { CallbackTypes, EventTypes } from "./EventTypes";
import { useSignal } from "../../eventProvider/EventProvider";
import { Employee } from "../../employees/employeeSlice";

const EmployeeDataGrid = () => {
    const workplaceId = useWorkplaceId();
    const employees = useSelector((state: RootState) =>
        employeesByWorkplaceSelector(state, workplaceId)
    );

    const signalUpdate: CallbackTypes.EMPLOYEE_UPDATE = useSignal(
        EventTypes.EMPLOYEE_UPDATE
    );

    const columnDefs = React.useMemo<GridColDef[]>(
        () => [
            {
                field: "id",
                headerName: "#",
                type: "number",
            },
            {
                field: "name",
                headerName: "Name",
                flex: 1,
                valueGetter: getFullName,
                sortComparator: (v1, v2, cellParams1, cellParams2) =>
                    getFullName(cellParams1).localeCompare(
                        getFullName(cellParams2)
                    ),
            },
            {
                field: "actions",
                type: "actions",
                getActions: (params: GridRowParams<Employee>) => [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() =>
                            signalUpdate({ employeeId: params.row.id })
                        }
                    />,
                ],
            },
        ],
        [signalUpdate]
    );

    return (
        <div style={{ height: 400, width: "100%" }}>
            <DataGrid columns={columnDefs} rows={employees} />
        </div>
    );
};

export default EmployeeDataGrid;

/**
 *
 */

const getFullName = (params: any) =>
    `${params.getValue(params.id, "first_name")} ${params.getValue(
        params.id,
        "last_name"
    )}`;
