import { RootState } from "../../store";
import { Shift } from "../shifts/shiftSlice";

export enum SECOND_INDEX {
    Employee = "Employee",
    Role = "Role",
}

export type SingleShiftItemComponent = React.FunctionComponent<{
    shiftId: number;
}>;
export type MultipleShiftItemComponent = React.FunctionComponent<{
    shiftsIds: number[];
}>;

export interface SecondIndexHandler<Item> {
    itemSelector: (state: RootState) => Item[];
    getId: (item: Item) => number;
    secondIndexType: SECOND_INDEX;
    itemToString: (item: Item) => string;
    ItemComponent: SingleShiftItemComponent | MultipleShiftItemComponent;
    getShiftComplementaryFromItemId: (itemId: number) => Partial<Shift>;
    getItemIdFromShift: (shift: Shift) => number;
}
