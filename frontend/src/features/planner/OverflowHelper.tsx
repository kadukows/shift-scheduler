import * as React from "react";

interface Props {}

const OverflowHelper = ({ children }: React.PropsWithChildren<Props>) => (
    <div
        style={{
            display: "flex",
            flexDirection: "row",
        }}
    >
        <div
            style={{
                width: 0,
                flex: "1 1 100%",
            }}
        >
            <div
                style={{
                    overflowX: "auto",
                    width: "100%",
                    height: "100%",
                }}
            >
                {children}
            </div>
        </div>
    </div>
);

export default OverflowHelper;
