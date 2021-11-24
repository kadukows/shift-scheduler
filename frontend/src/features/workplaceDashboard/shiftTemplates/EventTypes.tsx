export enum EventTypes {
    SHIFT_TEMPLATE_ADD = "SHIFT_TEMPLATE_ADD",
    SHIFT_TEMPLATE_UPDATE = "SHIFT_TEMPLATE_UPDATE",
}

export namespace CallbackTypes {
    export interface SHIFT_TEMPLATE_UPDATE_ARG_TYPE {
        shiftTemplateId: number;
    }

    export type SHIFT_TEMPLATE_ADD = () => void;
    export type SHIFT_TEMPLATE_UPDATE = (
        a: SHIFT_TEMPLATE_UPDATE_ARG_TYPE
    ) => void;
}
