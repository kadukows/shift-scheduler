import * as React from "react";
import { styled } from "@mui/material";
import { useDispatch } from "react-redux";
import { useGridAreaMemo } from "../../../genericCssGrid/GenericCssGrid";
import { set as addDialogSet } from "../../dialogs/addDialogSlice";

interface Props {
    day: Date;
    itemId: number;
}

const EmptyItem = ({ day, itemId }: Props) => {
    const gridArea = useGridAreaMemo({ xStart: day, yStart: { id: itemId } }, [
        day.getTime(),
        itemId,
    ]);

    const dispatch = useDispatch();

    return (
        <MyDiv
            onClick={() =>
                dispatch(
                    addDialogSet({
                        open: true,
                        start: day.getTime(),
                        end: day.getTime(),
                        secondIndexItemId: itemId,
                    })
                )
            }
            style={{ gridArea }}
        />
    );
};

export default EmptyItem;

const MyDiv = styled("div")({
    width: "100%",
    height: "100%",
    borderRadius: "3px",
    backgroundColor: "rgba(128, 128, 128, 0.2)",
    ":hover": {
        backgroundColor: "rgba(128, 128, 128, 0.4)",
    },
});
