export enum EventTypes {
    ADD_NEW_EMPLOYMENT = "ADD_NEW_EMPLOYMENT",
    DELETE_EMPLOYMENT = "DELETE_EMPLOYMENT",
}

export namespace CallbackTypes {
    export interface DELETE_EMPLOYMENT_ARG {
        employeeId: number;
    }

    export type ADD_NEW_EMPLOYMENT = () => void;
    export type DELETE_EMPLOYMENT = (arg: DELETE_EMPLOYMENT_ARG) => void;
}
