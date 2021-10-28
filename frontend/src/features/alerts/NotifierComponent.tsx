import * as React from "react";
import { useNotifier } from "./useNotifier";

interface Props {}

const NotifierComponent = (props: Props) => {
    useNotifier();

    return <div></div>;
};

export default NotifierComponent;
