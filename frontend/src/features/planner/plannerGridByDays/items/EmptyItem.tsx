import * as React from "react";
import { styled } from "@mui/material";
import { useGridAreaMemo } from "../../../genericCssGrid/GenericCssGrid";

interface Props {
    day: Date;
    itemId: number;
}

const EmptyItem = ({ day, itemId }: Props) => {
    const gridArea = useGridAreaMemo({ xStart: day, yStart: { id: itemId } }, [
        day.getTime(),
        itemId,
    ]);

    return <MyDiv style={{ gridArea }} />;
};

export default EmptyItem;

const MyDiv = styled("div")({
    width: "100%",
    height: "100%",
    borderRadius: "3px",
    color: "rgba(128, 128, 128, 0.2)",
    ":hover": {
        color: "rgba(128, 128, 128, 0.4)",
    },
});
