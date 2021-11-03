export enum EventTypes {
    ROLE_ADD = "ROLE_ADD",
    ROLE_UPDATE = "ROLE_UPDATE",
    ROLE_DELETION = "ROLE_DELETION",
}

export namespace CallbackTypes {
    interface ROLE_UPDATE_ARG_TYPE {
        roleId: number;
    }

    export type ROLE_UPDATE = (a: ROLE_UPDATE_ARG_TYPE) => void;
}
