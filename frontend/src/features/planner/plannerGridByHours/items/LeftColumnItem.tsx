import * as React from "react";
import { styled, Typography, Box } from "@mui/material";
import {
    useGridCorner,
    useGridRow,
} from "../../../genericCssGrid/GenericCssGrid";

interface Props<Item> {
    xStart: string;
    yStart: Item | string;
    corner?: boolean;
}

const LeftColumnItem = <Item extends unknown>({
    xStart,
    yStart,
    corner,
    children,
}: React.PropsWithChildren<Props<Item>>) => {
    const gridArea = corner
        ? useGridCorner({ xStart, yStart: yStart as string })
        : useGridRow({ xStart, yStart });

    const Comp = StickyBox;

    return <Comp style={{ gridArea }}>{children}</Comp>;
};

export default LeftColumnItem;

/**
 *
 */

const StickyTypography = styled(Typography)(({ theme }) => ({
    position: "sticky",
    left: 0,
    marginRight: theme.spacing(2),
}));

const FullTypograhy = styled(Typography)({
    width: "100%",
    height: "100%",
});

const StickyBox = styled(Box)(({ theme }) => ({
    ...theme.typography.body1,
    position: "sticky",
    left: 0,
    padding: theme.spacing(2),
    whiteSpace: "nowrap",
    backgroundColor: theme.status.plannerByHoursItemColor,
    outline: `1px solid ${theme.status.plannerByHoursItemColor}`,
    zIndex: 10,
    textAlign: "center",
}));
