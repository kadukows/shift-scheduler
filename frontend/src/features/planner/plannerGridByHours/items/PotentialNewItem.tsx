import * as React from "react";
import { styled } from "@mui/material";

interface Props {}

const MyDiv = styled("div")({
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(128, 128, 128, 0.1)",
});

const PotentialNewItem = (props: Props) => {
    return <MyDiv />;
};

export default PotentialNewItem;
