export enum EventTypes {
    EMPLOYEE_AVAILABILITY_ADD = "EMPLOYEE_AVAILABILITY_ADD",
    EMPLOYEE_AVAILABILITY_UPDATE = "EMPLOYEE_AVAILABILITY_UPDATE",
}

export namespace CallbackTypes {
    export interface EMPLOYEE_AVAILABILITY_UPDATE_ARG_TYPE {
        employeeAvailabilityId: number;
    }

    export interface EMPLOYEE_AVAILABILITY_ADD_ARG_TYPE {
        date: Date;
        employeeId: number;
    }

    export type EMPLOYEE_AVAILABILITY_ADD = (
        a: EMPLOYEE_AVAILABILITY_ADD_ARG_TYPE
    ) => void;
    export type EMPLOYEE_AVAILABILITY_UPDATE = (
        a: EMPLOYEE_AVAILABILITY_UPDATE_ARG_TYPE
    ) => void;
}
