import * as React from "react";
import * as DateFns from "date-fns";
import { useSelector } from "react-redux";
import { Paper, Typography } from "@material-ui/core";

import { Props as GenericCssGridProps } from "../genericCssGrid/GenericCssGrid";
import { RootState } from "../../store";
import { Employee } from "../employees/employeeSlice";
import AnnotatedGenericCssGrid from "../genericCssGrid/AnnotatedGenericCssGrid";
import { Role } from "../roles/rolesSlice";

export interface YIndexProvider<Item> {
    selector: (state: RootState) => Item[];
    annotate: (item: Item) => React.ReactNode;
}

export type ItemsGenerator = (
    xIndices: Date[],
    yIndices: (Role | Employee)[]
) => GenericCssGridProps<Date, Role | Employee>["items"];

interface Props {
    dates: Date[];
    yIndexProvider: YIndexProvider<Role> | YIndexProvider<Employee>;
    itemsGenerator: ItemsGenerator;
}

const PlannerGrid = ({ dates, yIndexProvider, itemsGenerator }: Props) => {
    const { selector, annotate } = yIndexProvider;
    // @ts-expect-error
    const payloads = useSelector(selector);

    const annotateX = (date: Date) => (
        <Paper
            style={{
                padding: "8px",
                textAlign: "center",
            }}
        >
            <Typography noWrap>
                {DateFns.format(date, "dd.MM, EEEE")}
            </Typography>
        </Paper>
    );

    const items = itemsGenerator(dates, payloads);

    return (
        <div
            style={{
                display: "flex",
            }}
        >
            <div
                style={{
                    width: 0,
                    flex: "1 1 100%",
                }}
            >
                <AnnotatedGenericCssGrid<Date, Employee | Role>
                    x={{
                        cells: dates,
                        getId: (date) => date.getDate(),
                    }}
                    y={{
                        cells: payloads,
                        getId: (employeeOrRole) => employeeOrRole.id,
                    }}
                    annotateX={annotateX}
                    annotateY={annotate}
                    items={items}
                    style={{
                        overflowX: "auto",
                        width: "100%",
                        height: "100%",
                        gap: "8px",
                        marginBottom: "24px",
                        paddingBottom: "24px",
                    }}
                />
            </div>
        </div>
    );
};

export default PlannerGrid;
