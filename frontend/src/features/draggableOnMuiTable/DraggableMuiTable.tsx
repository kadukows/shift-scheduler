import * as React from "react";
//import { Table,  } from "@material-ui/core";
import { RootState } from "../../store";
import { useSelector } from "react-redux";
import DragOnField from "./DragOnField";

import "./style.css";

const DraggableMuiTable = () => {
    /*
    const squares = useSelector(
        (state: RootState) => state.draggableThingsReducer
    ).squares;
    */

    const dragOnFields = [];

    for (let idx = 0; idx < 9; ++idx) {
        dragOnFields.push(<DragOnField key={idx} idx={idx} />);
    }

    return <div className="grid-container">{dragOnFields}</div>;
};

export default DraggableMuiTable;
