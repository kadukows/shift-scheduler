import * as React from "react";
import * as DateFns from "date-fns";
import { Paper, TextField, MenuItem, Stack, Box, styled } from "@mui/material";
import DateRangePicker, { DateRange } from "@mui/lab/DateRangePicker";

import { RootState } from "../../store";
import { Schedule } from "../schedules/scheduleSlice";
import { Shift, shiftSelectors } from "../shifts/shiftSlice";
import { employeeSelectors } from "../employees/employeeSlice";
import { Employee } from "../employees/employeeSlice";
import { employeeToString } from "../employees/helpers";
import { Role, roleSelectors } from "../roles/rolesSlice";

import {
    SecondIndexHandler,
    SECOND_INDEX,
    SingleShiftItemComponent,
    MultipleShiftItemComponent,
} from "./SecondIndexHandler";

/**
 * By Hours imports
 */
import PlannerByHours from "./plannerGridByHours/PlannerByHours";
import EmployeeItemByHours from "./plannerGridByHours/items/secondIndexItems/EmployeeItem";
import RoleItemByHours from "./plannerGridByHours/items/secondIndexItems/RoleItem";

/**
 * By Days imports
 */
import PlannerGridByDays from "./plannerGridByDays/PlannerGridByDays";
import EmployeeItemByDays from "./plannerGridByDays/items/secondIndexItem/EmployeeItem";
import RoleItemByDays from "./plannerGridByDays/items/secondIndexItem/RoleItem";

/**
 * Dialogs imports
 */
import AddEmployeeDialog from "./dialogs/AddEmployeeDialog";
import AddRoleDialog from "./dialogs/AddRoleDialog";
import UpdateEmployeeDialog from "./dialogs/UpdateEmployeeDialog";
import UpdateRoleDialog from "./dialogs/UpdateRoleDialog";
import PlannerGridByHours from "./plannerGridByHours/PlannerGridByHours";

interface Props {
    schedule: Schedule;
}

const PlannerBoard = ({ schedule }: Props) => {
    const [secondIdx, setSecondIdx] = React.useState<SECOND_INDEX>(
        SECOND_INDEX.Employee
    );
    const [timeGrouping, setTimeGrouping] = React.useState<TIME_GROUPING>(
        TIME_GROUPING.ByHours
    );
    const monthYear = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());
    const [dateRange, setDateRange] = React.useState<DateRange<Date>>([
        monthYear,
        DateFns.endOfMonth(monthYear),
    ]);

    const timeRangeRef = React.useRef(toInterval(dateRange));

    //
    // planner grid by hours
    //

    //const monthYear = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());

    /*
    const timeRange = {
        start: monthYear.getTime(),
        end: DateFns.endOfDay(
            DateFns.addDays(DateFns.addMonths(monthYear, 1), -2)
        ).getTime(),
    };
    */

    const timeRange =
        dateRange[0] !== null && dateRange[1] !== null
            ? toInterval(dateRange)
            : timeRangeRef.current;
    timeRangeRef.current = timeRange;

    const secondIndexHandler:
        | SecondIndexHandler<Employee>
        | SecondIndexHandler<Role> = React.useMemo(() => {
        return secondIndexDict[timeGrouping][secondIdx](schedule);
    }, [schedule.workplace, secondIdx, timeGrouping]);

    const shiftSelector = React.useCallback(
        (state: RootState) =>
            shiftSelectors
                .selectAll(state)
                .filter((shift) => shift.schedule === schedule.id)
                .filter(
                    (shift) =>
                        DateFns.compareDesc(
                            timeRange.start,
                            Date.parse(shift.time_from)
                        ) !== -1
                )
                .filter(
                    (shift) =>
                        DateFns.compareDesc(
                            Date.parse(shift.time_to),
                            timeRange.end
                        ) !== -1
                ),
        [timeRange.start, timeRange.end, schedule.id]
    );

    interface PlannerProps {
        timeRange: DateFns.Interval;
        secondIndexHandler:
            | SecondIndexHandler<Role>
            | SecondIndexHandler<Employee>;
        shiftSelector: (state: RootState) => Shift[];
    }

    const PlannerComponent: React.ComponentType<PlannerProps> =
        timeGrouping === TIME_GROUPING.ByHours
            ? PlannerGridByHours
            : PlannerGridByDays;

    return (
        <Paper sx={{ p: 3 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                <TextField
                    select
                    label="Second index"
                    onChange={(e) =>
                        setSecondIdx(e.target.value as SECOND_INDEX)
                    }
                    value={secondIdx}
                    style={{ minWidth: 120 }}
                >
                    <MenuItem value={SECOND_INDEX.Employee}>Employee</MenuItem>
                    <MenuItem value={SECOND_INDEX.Role}>Role</MenuItem>
                </TextField>
                <TextField
                    select
                    label="Time grouping"
                    onChange={(e) =>
                        setTimeGrouping(e.target.value as TIME_GROUPING)
                    }
                    value={timeGrouping}
                    style={{ minWidth: 120 }}
                >
                    <MenuItem value={TIME_GROUPING.ByHours}>By Hours</MenuItem>
                    <MenuItem value={TIME_GROUPING.ByDays}>By Days</MenuItem>
                </TextField>
                <Spacer />
                <DateRangePicker
                    value={dateRange}
                    onChange={(value: DateRange<Date>) => setDateRange(value)}
                    minDate={monthYear}
                    maxDate={DateFns.endOfMonth(monthYear)}
                    showDaysOutsideCurrentMonth={false}
                    renderInput={(startProps, endProps) => (
                        <React.Fragment>
                            <TextField {...startProps} />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} />
                        </React.Fragment>
                    )}
                />
            </Stack>

            <PlannerComponent
                timeRange={timeRange}
                secondIndexHandler={secondIndexHandler}
                shiftSelector={shiftSelector}
            />
            {secondIdx === SECOND_INDEX.Employee ? (
                <>
                    <AddEmployeeDialog
                        scheduleId={schedule.id}
                        workplaceId={schedule.workplace}
                    />
                    <UpdateEmployeeDialog />
                </>
            ) : (
                <>
                    <AddRoleDialog
                        scheduleId={schedule.id}
                        workplaceId={schedule.workplace}
                    />
                    <UpdateRoleDialog />
                </>
            )}
        </Paper>
    );
};

export default PlannerBoard;

/**
 *
 */

const getEmployeeSecondIndexHandlerBase = (
    schedule: Schedule
): Omit<SecondIndexHandler<Employee>, "ItemComponent"> => ({
    itemSelector: (state: RootState) =>
        employeeSelectors
            .selectAll(state)
            .filter((employee) => employee.workplace === schedule.workplace),
    getId: (a: Employee) => a.id,
    secondIndexType: SECOND_INDEX.Employee,
    itemToString: employeeToString,
    getShiftComplementaryFromItemId: (itemId: number) => ({ employee: itemId }),
    getItemIdFromShift: (shift: Shift) => shift.employee,
});

const getRoleSecondIndexHandlerBase = (
    schedule: Schedule
): Omit<SecondIndexHandler<Role>, "ItemComponent"> => ({
    itemSelector: (state: RootState) =>
        roleSelectors
            .selectAll(state)
            .filter((role) => role.workplace === schedule.workplace),
    getId: (a: Role) => a.id,
    secondIndexType: SECOND_INDEX.Role,
    itemToString: (role: Role) => role.name,
    getShiftComplementaryFromItemId: (itemId: number) => ({ role: itemId }),
    getItemIdFromShift: (shift: Shift) => shift.role,
});

/**
 *
 */

enum TIME_GROUPING {
    ByHours = "ByHours",
    ByDays = "ByDays",
}

const secondIndexDict = {
    [TIME_GROUPING.ByHours]: {
        [SECOND_INDEX.Employee]: (
            schedule: Schedule
        ): SecondIndexHandler<Employee> => ({
            ...getEmployeeSecondIndexHandlerBase(schedule),
            ItemComponent: EmployeeItemByHours,
        }),
        [SECOND_INDEX.Role]: (
            schedule: Schedule
        ): SecondIndexHandler<Role> => ({
            ...getRoleSecondIndexHandlerBase(schedule),
            ItemComponent: RoleItemByHours,
        }),
    },
    [TIME_GROUPING.ByDays]: {
        [SECOND_INDEX.Employee]: (
            schedule: Schedule
        ): SecondIndexHandler<Employee> => ({
            ...getEmployeeSecondIndexHandlerBase(schedule),
            ItemComponent: EmployeeItemByDays,
        }),
        [SECOND_INDEX.Role]: (
            schedule: Schedule
        ): SecondIndexHandler<Role> => ({
            ...getRoleSecondIndexHandlerBase(schedule),
            ItemComponent: RoleItemByDays,
        }),
    },
};

const toInterval = (dateRange: DateRange<Date>) => ({
    start: dateRange[0].getTime(),
    end: dateRange[1].getTime(),
});

const Spacer = styled("div")({
    flex: 1,
});
