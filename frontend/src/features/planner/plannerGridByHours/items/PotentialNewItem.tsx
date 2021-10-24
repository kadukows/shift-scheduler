import * as React from "react";
import { styled } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";

interface Props {}

const PotentialNewShiftDiv = styled("div")({
    backgroundColor: "rgba(128, 128, 128, 0.6)",
    width: "100%",
    height: "100%",
    zIndex: 0,
});

const PotentialNewItem = (props: Props) => {
    const plannerByHourReducer = useSelector(
        (state: RootState) => state.plannerByHourReducer
    );

    const potentialNewShift = plannerByHourReducer.potentialNewShift;

    const potentialNewShiftIsValid = ({
        start,
        end,
        itemId,
    }: typeof plannerByHourReducer["potentialNewShift"]) =>
        start && end && itemId;

    return potentialNewShiftIsValid(potentialNewShift) ? (
        <PotentialNewItemImpl {...potentialNewShift} />
    ) : (
        <React.Fragment />
    );
};

interface PotentialNewItemImplProps {
    start: number;
    end: number;
    itemId: number;
}

const PotentialNewItemImpl = ({
    start,
    end,
    itemId,
}: PotentialNewItemImplProps) => {
    const gridArea = useGridArea({
        xStart: new Date(start),
        yStart: { id: itemId },
        xEnd: new Date(end),
    });

    return <PotentialNewShiftDiv style={{ gridArea }} />;
};

export default PotentialNewItem;
