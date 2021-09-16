import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Square {
    color: string;
}

export const SQUARES_SIZE = 9;

interface DraggablesState {
    squares: Square[]; // [0, 9)
    chosenColor: string;
}

const initialState: DraggablesState = {
    squares: Array(9),
    chosenColor: null,
};

interface SetDragabblePayload {
    idx: number;
    square: Square;
}

const draggableThingsSlice = createSlice({
    name: "draggableThings",
    initialState,
    reducers: {
        setDraggable(state, action: PayloadAction<SetDragabblePayload>) {
            const { idx, square } = action.payload;
            console.assert(
                0 <= idx && idx < 9,
                "Idx is not in between 0 and 9"
            );

            state.squares[idx] = square;
        },
        removeDraggable(state, action: PayloadAction<number>) {
            state.squares[action.payload] = null;
        },
        setChosenColor(state, action: PayloadAction<string>) {
            state.chosenColor = action.payload;
        },
    },
});

export const { setDraggable, removeDraggable, setChosenColor } =
    draggableThingsSlice.actions;
export const draggableThingsReducer = draggableThingsSlice.reducer;
