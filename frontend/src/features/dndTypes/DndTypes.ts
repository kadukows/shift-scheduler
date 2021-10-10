import { Employee } from "../employees/employeeSlice";
import { Role } from "../roles/rolesSlice";

export const ItemTypes = {
    COLORSQUARE: "COLORSQUARE",
    SHIFT_W_ROLE: "SHIFT_W_ROLE",
    SHIFT_W_EMPLOYEE: "SHIFT_W_EMPLOYEE",
};

export namespace ItemTypesPassed {
    export interface COLORSQUARE {
        color: string;
    }

    export interface SHIFT_W_ROLE {
        role: Role;
        duration: number; // number of seconds
    }

    export interface SHIFT_W_EMPLOYEE {
        employee: Employee;
        duration: number;
    }
}
