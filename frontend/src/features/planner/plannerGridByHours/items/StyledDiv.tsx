import { styled, Typography, Box } from "@mui/material";

export const BorderedDiv = styled(Box)({
    width: "100%",
    height: "100%",
    outline: "1px solid rgba(128, 128, 128, 0.4)",
});

export const PlannerByHoursSecondItemDiv = styled(Box)(({ theme }) => ({
    width: "100%",
    height: "100%",
    backgroundColor: theme.status.plannerByHoursItemColor,
    textAlign: "center",
    borderRadius: "3px",
    border: theme.status.plannerByHoursItemBorder,
    ":hover": {
        backgroundColor: theme.status.plannerByHoursItemHover,
    },
}));

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
