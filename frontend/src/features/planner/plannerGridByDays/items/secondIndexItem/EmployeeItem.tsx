import * as React from "react";
import GenericSecondIndexItem from "./GenericSecondIndexItem";
import { Employee } from "../../../../employees/employeeSlice";
import { Role } from "../../../../roles/rolesSlice";

interface Props {
    shiftsIds: number[];
}

const EmployeeItem = ({ shiftsIds }: Props) => {
    return (
        <GenericSecondIndexItem
            shiftsId={shiftsIds}
            getSecondIndex={getEmployee}
            getNodeDesc={getNodeDesc}
        />
    );
};

export default EmployeeItem;

/**
 *
 */

const getEmployee = (employee: Employee, role: Role) => employee;
const getNodeDesc = (employee: Employee, role: Role) => role.name;
