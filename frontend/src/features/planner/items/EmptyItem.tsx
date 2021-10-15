import * as React from "react";
import { Paper } from "@material-ui/core";

import { Indices } from "./ItemFactory";

interface Props {
    indices: Indices;
}

const EmptyItem = ({ indices }: Props) => {
    const [entered, setEntered] = React.useState(false);

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "gray",
                border: "1px solid gray",
                borderRadius: "16px",
                opacity: entered ? 0.4 : 0.2,
            }}
            onMouseEnter={() => setEntered(true)}
            onMouseLeave={() => setEntered(false)}
        />
    );
};

export default EmptyItem;
