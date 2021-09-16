import * as React from "react";
import { Table, Paper } from "@material-ui/core";
import { RootState } from "../../store";
import { useSelector } from "react-redux";

import DragOnField from "./DragOnField";

import "./style.css";

const DraggableMuiTable = () => {
    const dragOnFields = [];

    for (let idx = 0; idx < 9; ++idx) {
        dragOnFields.push(<DragOnField key={idx} idx={idx} />);
    }

    return (
        <Paper style={{ padding: "1rem" }}>
            <div className="grid-container">{dragOnFields}</div>
        </Paper>
    );
};

export default DraggableMuiTable;
