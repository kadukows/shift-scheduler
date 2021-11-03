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
import { useSignal } from "../../eventProvider/EventProvider";
import { CallbackTypes, EventTypes } from "./EventTypes";
import { Role } from "../../roles/rolesSlice";

interface Props {}

const RoleDataGrid = (props: Props) => {
    const workplaceId = useWorkplaceId();
    const roles = useSelector((state: RootState) =>
        rolesByWorkplaceSelector(state, workplaceId)
    );

    const signalUpdate: CallbackTypes.ROLE_UPDATE = useSignal(
        EventTypes.ROLE_UPDATE
    );

    const columnDefs = React.useMemo(
        () => [
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
                getActions: (params: GridRowParams<Role>) => [
                    <GridActionsCellItem
                        icon={<EditIcon />}
                        label="Edit"
                        onClick={() => signalUpdate({ roleId: params.row.id })}
                    />,
                ],
            },
        ],
        [signalUpdate]
    );

    return (
        <div style={{ height: 350, width: "100%" }}>
            <DataGrid columns={columnDefs} rows={roles} />
        </div>
    );
};

export default RoleDataGrid;

/**
 *
 */
