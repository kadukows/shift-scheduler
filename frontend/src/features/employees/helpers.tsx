import { Employee } from "./employeeSlice";

export const employeeToString = (employee: Employee) => {
    if (employee) {
        return `${employee.first_name} ${employee.last_name}`;
    }

    return null;
};
