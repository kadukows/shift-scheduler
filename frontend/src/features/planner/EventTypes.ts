import { Employee } from "../employees/employeeSlice";
import { Role } from "../roles/rolesSlice";
import { Shift } from "../shifts/shiftSlice";

const EventTypes = {
    EMPTY_FIELD_CLICKED: "EMPTY_FIELD_CLICKED",
    NON_EMPTY_FIELD_CLICKED: "NON_EMPTY_FIELD_CLICKED",
};

export namespace CallbackTypes {
    export type EMPTY_FIELD_CLICKED = (
        date: Date,
        secondIdx: "Employee" | "Role",
        payload: Employee | Role
    ) => void;

    export type NON_EMPTY_FIELD_CLICKED = (
        date: Date,
        secondIdx: "Employee" | "Role",
        payload: Employee | Role,
        shift: Shift
    ) => void;
}

export default EventTypes;
