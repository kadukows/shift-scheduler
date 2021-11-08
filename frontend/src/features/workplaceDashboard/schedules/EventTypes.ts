export enum EventTypes {
    SCHEDULE_UPDATE = "SCHEDULE_UPDATE",
    SCHEDULE_ADD = "SCHEDULE_ADD",
}

export namespace CallbackTypes {
    export interface SCHEDULE_UPDATE_ARG_TYPE {
        scheduleId: number;
    }

    export type SCHEDULE_UPDATE = (arg: SCHEDULE_UPDATE_ARG_TYPE) => void;
    export type SCHEDULE_ADD = () => void;
}
