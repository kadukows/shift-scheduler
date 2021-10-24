import { styled, Typography } from "@mui/material";

export const BorderedDiv = styled("div")({
    width: "100%",
    height: "100%",
    outline: "1px solid rgba(128, 128, 128, 0.4)",
});

export const StyledDiv = styled("div")({
    width: "100%",
    height: "100%",
    backgroundColor: "rgb(128, 128, 128)",
    textAlign: "center",
    borderRadius: "3px",
    border: "1px solid white",
    ":hover": {
        backgroundColor: "rgb(148, 148, 148)",
    },
});

export const BorderTypography = styled(Typography)({
    width: "100%",
    height: "100%",
    outline: "1px solid rgba(128, 128, 128, 0.4)",
});

export const HoverableDiv = styled("div")({
    zIndex: 2,
    ":hover": {
        zIndex: 3,
    },
});
