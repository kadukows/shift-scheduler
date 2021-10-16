import { Employee } from "../employees/employeeSlice";

const EventTypes = {
    EMPTY_FIELD_W_EMPLOYEE_CLICKED: "EMPTY_FIELD_W_EMPLOYEE_CLICKED",
};

export namespace CallbackTypes {
    export type EMPTY_FIELD_W_EMPLOYEE_CLICKED = (
        date: Date,
        employee: Employee
    ) => void;
}

export default EventTypes;
