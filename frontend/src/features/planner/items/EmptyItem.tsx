import * as React from "react";
import { Paper } from "@material-ui/core";

import { Indices } from "./ItemFactory";

interface Props {
    indices: Indices;
}

const EmptyItem = ({ indices }: Props) => {
    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "gray",
                border: "1px solid gray",
                borderRadius: "16px",
                opacity: "20%",
            }}
        ></div>
    );
};

export default EmptyItem;
