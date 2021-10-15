import * as React from "react";

import ItemBase from "./ItemBase";
import { Indices } from "./ItemFactory";

import "./style.css";

interface Props {
    indices: Indices;
}

const EmptyItem = ({ indices }: Props) => {
    return <ItemBase className="planner-items-hoverable" />;
};

export default EmptyItem;
