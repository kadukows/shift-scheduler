export enum EventTypes {
    ROLE_ADD = "ROLE_ADD",
    ROLE_UPDATE = "ROLE_UPDATE",
}

export namespace CallbackTypes {
    interface ROLE_UPDATE_ARG_TYPE {
        roleId: number;
    }

    export type ROLE_UPDATE = (a: ROLE_UPDATE_ARG_TYPE) => void;
    export type ROLE_ADD = () => void;
}
