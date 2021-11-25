import { parse, startOfDay, endOfDay } from "date-fns";
import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { Employee } from "../../../employees/employeeSlice";
import { useGridArea } from "../../../genericCssGrid/GenericCssGrid";
import {
    LA_Type,
    LimitedAvailability,
    limitedAvailabilitySelectors,
} from "../../../limitedAvailability/limitedAvailablitySlice";
import { shiftTemplateSelectors } from "../../../shiftTemplates/shiftTemplates";
import { Box, styled } from "@mui/material";

interface Props {
    laId: number;
}

const LaItem = ({ laId }: Props) => {
    const la = useSelector((state: RootState) =>
        limitedAvailabilitySelectors.selectById(state, laId)
    );

    return la.la_type === LA_Type.FreeDay ? (
        <Impl la={la} />
    ) : (
        <React.Fragment>
            {la.shift_templates.map((stId) => (
                <Impl la={la} stId={stId} key={stId} />
            ))}
        </React.Fragment>
    );
};

export default LaItem;

interface ImplProps {
    la: LimitedAvailability;
    stId?: number;
}

const Impl = ({ la, stId }: ImplProps) => {
    const st = useSelector((state: RootState) =>
        shiftTemplateSelectors.selectById(state, stId)
    );
    const parsedDay = parse(la.date, "yyyy-MM-dd", new Date());

    const args: any = {
        xStart: st
            ? parse(st.time_from, "HH:mm:ss", parsedDay)
            : startOfDay(parsedDay),
        xEnd: st
            ? parse(st.time_to, "HH:mm:ss", parsedDay)
            : endOfDay(parsedDay),
        yStart: { id: la.employee },
    };

    const gridArea = useGridArea(args);

    return <RedBox sx={{ gridArea }} />;
};

const RedBox = styled(Box)({
    backgroundColor: "rgba(128, 50, 34, .7)",
    borderRadius: "2px",
    padding: 2,
    width: "100%",
    height: "100%",
    zIndex: 3,
});
