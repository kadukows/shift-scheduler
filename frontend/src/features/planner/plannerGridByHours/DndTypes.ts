export enum DndTypes {
    EMPTY_ITEM_DRAG = "EMPTY_ITEM_DRAG",
    SHIFT_ITEM_DRAG = "SHIFT_ITEM_DRAG",
}

export namespace ItemPassed {
    export type EMPTY_ITEM_DRAG = {
        hour: number;
        itemId: number;
    };

    export type SHIFT_ITEM_DRAG = {
        shiftId: number;
        shiftTimeFrom: number;
        shiftTimeTo: number;
        width: number;
        height: number;
    };
}

export const getDndTypeForItemId = (dndType: DndTypes, itemId: number) =>
    `${dndType}-${itemId}`;
