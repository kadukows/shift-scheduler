import * as React from "react";
import { Employee } from "../../../../employees/employeeSlice";
import { Role } from "../../../../roles/rolesSlice";
import GenericSecondIndexItemId from "./GenericSecondIndexItem";
import { employeeToString } from "../../../../employees/helpers";

interface Props {
    shiftsIds: number[];
}

const RoleItem = ({ shiftsIds }: Props) => {
    return (
        <GenericSecondIndexItemId
            shiftsId={shiftsIds}
            getSecondIndex={getRole}
            getNodeDesc={getRoleDesc}
        />
    );
};

export default RoleItem;

const getRole = (employee: Employee, role: Role) => role;
const getRoleDesc = (employee: Employee, role: Role) =>
    employeeToString(employee);
