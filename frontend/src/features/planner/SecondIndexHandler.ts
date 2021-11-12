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

export type ItemComponentType =
    | SingleShiftItemComponent
    | MultipleShiftItemComponent;

export interface SecondIndexHandler<Item> {
    getId: (item: Item) => number;
    secondIndexType: SECOND_INDEX;
    itemToString: (item: Item) => string;
    ItemComponent: ItemComponentType;
    getShiftComplementaryFromItemId: (itemId: number) => Partial<Shift>;
    getItemIdFromShift: (shift: Shift) => number;
}
