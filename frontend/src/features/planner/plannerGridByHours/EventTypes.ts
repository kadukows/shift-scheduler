import { Shift } from "../../shifts/shiftSlice";

export enum EventTypes {
    EMPLOYEE_ITEM_CLICK = "EMPLOYEE_ITEM_CLICK",
    ROLE_ITEM_CLICK = "ROLE_ITEM_CLICK",
    POTENTIAL_NEW_SHIFT_START_DRAG = "POTENTIAL_NEW_SHIFT_START_DRAG",
    POTENTIAL_NEW_SHIFT_HOVER = "POTENTIAL_NEW_SHIFT_HOVER",
    POTENTIAL_NEW_SHIFT_RESET = "POTENTIAL_NEW_SHIFT_RESET",
    POTENTIAL_NEW_SHIFT_END_DRAG = "POTENTIAL_NEW_SHIFT_END_DRAG",
    ADD_BY_EMPLOYEE = "ADD_BY_EMPLOYEE",
    ADD_BY_ROLE = "ADD_BY_ROLE",
}

export interface POTENTIAL_NEW_SHIFT_START_DRAG_EVENT {
    start: number;
    itemId: number;
}

export interface ADD_BY_EVENT_ARG {
    start: number;
    end: number;
    secondIndexItemId: number;
}

export namespace CallbackTypes {
    export type EMPLOYEE_ITEM_CLICK = (shift: Shift) => void;
    export type ROLE_ITEM_CLICK = (shift: Shift) => void;
    export type POTENTIAL_NEW_SHIFT_START_DRAG = (
        event: POTENTIAL_NEW_SHIFT_START_DRAG_EVENT
    ) => void;
    export type POTENTIAL_NEW_SHIFT_HOVER = (newEnd: number) => void;
    export type POTENTIAL_NEW_SHIFT_END_DRAG = () => void;
    //export type POTENTIAL_NEW_SHIFT_END_DRAG = () => void;
    export type ADD_BY_EMPLOYEE = (args: ADD_BY_EVENT_ARG) => void;
    export type ADD_BY_ROLE = (args: ADD_BY_EVENT_ARG) => void;
}
