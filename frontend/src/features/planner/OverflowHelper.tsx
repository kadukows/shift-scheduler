import * as React from "react";
import { styled } from "@mui/material";

const OverflowHelper = ({ children }: React.PropsWithChildren<{}>) => (
    <FlexContainer>
        <FlexiCollapse>
            <OverflowXImpl>{children}</OverflowXImpl>
        </FlexiCollapse>
    </FlexContainer>
);

export default OverflowHelper;

const FlexContainer = styled("div")({
    display: "flex",
    flexDirection: "row",
});

const FlexiCollapse = styled("div")({
    width: 0,
    flex: "1 1 100%",
});

const OverflowXImpl = styled("div")({
    overflowX: "auto",
    width: "100%",
    height: "100%",
});
