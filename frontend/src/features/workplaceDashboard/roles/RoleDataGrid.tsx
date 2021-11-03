import * as React from "react";
import {
    DataGrid,
    GridColDef,
    GridRowParams,
    GridActionsCellItem,
} from "@mui/x-data-grid";
import { Edit as EditIcon } from "@mui/icons-material";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import { rolesByWorkplaceSelector } from "./RoleByWorkplaceSelector";

interface Props {}

const RoleDataGrid = (props: Props) => {
    const workplaceId = useWorkplaceId();
    const roles = useSelector((state: RootState) =>
        rolesByWorkplaceSelector(state, workplaceId)
    );

    return (
        <div style={{ height: 300, width: "100%" }}>
            <DataGrid columns={columnDefs} rows={roles} />
        </div>
    );
};

export default RoleDataGrid;

/**
 *
 */

const columnDefs = [
    {
        field: "id",
        headerName: "#",
        type: "number",
    },
    {
        field: "name",
        headerName: "Name",
        flex: 5,
    },
    {
        field: "actions",
        type: "actions",
        getActions: (params: GridRowParams) => [
            <GridActionsCellItem
                icon={<EditIcon />}
                label="Edit"
                onClick={() => alert(`Clicked edit on role: ${params.row.id}`)}
            />,
        ],
    },
];
