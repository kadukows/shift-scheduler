import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { shiftSelectors } from "../../../shifts/shiftSlice";

interface Props {
    shiftId: number;
}

const ShiftItem = ({ shiftId }: Props) => {
    const shift = useSelector((state: RootState) =>
        shiftSelectors.selectById(state, shiftId)
    );

    return <div></div>;
};

export default ShiftItem;
