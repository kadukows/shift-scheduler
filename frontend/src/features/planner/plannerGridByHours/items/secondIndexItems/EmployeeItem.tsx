import * as React from "react";
import { Employee } from "../../../../employees/employeeSlice";

import { Role } from "../../../../roles/rolesSlice";
import GenericSecondIndexItemId from "./GenericSecondIndexItem";

interface Props {
    shiftId: number;
}

const RoleItem = ({ shiftId }: Props) => {
    return (
        <GenericSecondIndexItemId
            shiftId={shiftId}
            getSecondIndex={getEmployee}
            getNodeDesc={getNodeDesc}
        />
    );
};

export default RoleItem;

const getEmployee = (employee: Employee, role: Role) => employee;
const getNodeDesc = (employee: Employee, role: Role) => role.name;
