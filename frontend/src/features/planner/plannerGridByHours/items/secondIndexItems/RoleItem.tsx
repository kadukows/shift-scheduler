import * as React from "react";
import { Employee } from "../../../../employees/employeeSlice";
import { Role } from "../../../../roles/rolesSlice";
import GenericSecondIndexItemId from "./GenericSecondIndexItem";
import { employeeToString } from "../../../../employees/helpers";

interface Props {
    shiftId: number;
}

const RoleItem = ({ shiftId }: Props) => {
    return (
        <GenericSecondIndexItemId
            shiftId={shiftId}
            getSecondIndex={getRole}
            getNodeDesc={getRoleDesc}
        />
    );
};

export default RoleItem;

const getRole = (employee: Employee, role: Role) => role;
const getRoleDesc = (employee: Employee, role: Role) =>
    employeeToString(employee);
