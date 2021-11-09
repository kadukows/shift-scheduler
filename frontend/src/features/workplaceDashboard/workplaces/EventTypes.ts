export enum EventTypes {
    ADD_WORKPLACE = "ADD_WORKPLACE",
    UPDATE_WORKPLACE = "UPDATE_WORKPLACE",
}

export namespace CallbackTypes {
    export interface UPDATE_WORPLACE_ARG_TYPE {
        workplaceId: number;
    }

    export type UPDATE_WORKPLACE = (arg: UPDATE_WORPLACE_ARG_TYPE) => void;
    export type ADD_WORKPLACE = () => void;
}
