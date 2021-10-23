export enum DndTypes {
    EMPTY_ITEM_DRAG = "EMPTY_ITEM_DRAG",
}

export namespace ItemPassed {
    export type EMPTY_ITEM_DRAG = { hour: Date };
}

export const getDndTypeForItemId = (dndType: DndTypes, itemId: number) =>
    `${dndType}-${itemId}`;
