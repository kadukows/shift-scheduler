import * as React from "react";

import { Employee } from "../../employees/employeeSlice";
import { Role } from "../../roles/rolesSlice";
import { Shift } from "../../shifts/shiftSlice";

import PlannerItem from "./PlannerItem";
import EmptyItem from "./EmptyItem";

interface IndicesBase {
    date: Date;
}

interface EmployeeIndices extends IndicesBase {
    secondIdx: "Employee";
    employee: Employee;
}

interface RoleIndices extends IndicesBase {
    secondIdx: "Role";
    role: Role;
}

export type Indices = RoleIndices | EmployeeIndices;

interface Props {
    indices: Indices;
    shift?: Shift;
}

const ItemFactory = ({ indices, shift }: Props) => {
    return shift ? (
        <PlannerItem indices={indices} shift={shift} />
    ) : (
        <EmptyItem indices={indices} />
    );
};

export default ItemFactory;
