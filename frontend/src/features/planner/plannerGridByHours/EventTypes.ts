import { Shift } from "../../shifts/shiftSlice";

export enum EventTypes {
    EMPLOYEE_ITEM_CLICK = "EMPLOYEE_ITEM_CLICK",
}

export namespace CallbackTypes {
    export type EMPLOYEE_ITEM_CLICK = (shift: Shift) => void;
}
