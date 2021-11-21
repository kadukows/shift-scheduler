export enum EventTypes {
    EMPLOYEE_ADD = "EMPLOYEE_ADD",
    EMPLOYEE_UPDATE = "EMPLOYEE_UPDATE",
    EMPLOYEE_KEY_DIALOG_OPEN = "EMPLOYEE_KEY_DIALOG_OPEN",
}

export namespace CallbackTypes {
    export interface EMPLOYEE_UPDATE_ARG_TYPE {
        employeeId: number;
    }

    export type EMPLOYEE_UPDATE = (a: EMPLOYEE_UPDATE_ARG_TYPE) => void;
    export type EMPLOYEE_ADD = () => void;
    export type EMPLOYEE_KEY_DIALOG_OPEN = EMPLOYEE_UPDATE;
}
