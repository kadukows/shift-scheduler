import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { Employee, employeeSelectors } from "../../employees/employeeSlice";

export const employeesByWorkplaceSelector = createSelector(
    [
        (state: RootState) => employeeSelectors.selectAll(state),
        (state: RootState, workplaceId: number) => workplaceId,
    ],
    (employees, workplaceId) =>
        employees.filter(
            (employee: Employee) => employee.workplace === workplaceId
        )
);
