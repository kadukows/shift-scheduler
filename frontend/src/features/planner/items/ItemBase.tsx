import * as React from "react";

import { combineClx } from "../../helpers";

import "./style.css";

interface PropsBase extends React.ComponentProps<"div"> {}

type Props = React.PropsWithChildren<PropsBase>;

const ItemBase = ({ children, className, ...rest }: Props) => {
    return (
        <div className={combineClx(className, "planner-items-base")} {...rest}>
            {children}
        </div>
    );
};

export default ItemBase;
