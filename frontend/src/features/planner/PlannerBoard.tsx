import * as React from "react";
import * as DateFns from "date-fns";
import {
    Paper,
    TextField,
    MenuItem,
    Stack,
    Box,
    styled,
    Button,
    ButtonGroup,
    Dialog,
    DialogTitle,
    DialogActions,
    DialogContent,
    DialogContentText,
} from "@mui/material";
import DateRangePicker, { DateRange } from "@mui/lab/DateRangePicker";

import { RootState } from "../../store";
import {
    clearShiftsForSchedule,
    runSolverDefault,
    Schedule,
} from "../schedules/scheduleSlice";
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
import { limitedAvailabilitySelectors } from "../limitedAvailability/limitedAvailablitySlice";
import { compareAsc, parse } from "date-fns";
import { useDispatch, useSelector } from "react-redux";

interface Props {
    schedule: Schedule;
}

const PlannerBoard = ({ schedule }: Props) => {
    const [secondIdx, setSecondIdx] = React.useState<SECOND_INDEX>(
        (localStorage.getItem("PlannerBoard-SECOND_INDEX") as SECOND_INDEX) ??
            SECOND_INDEX.Employee
    );
    const [timeGrouping, setTimeGrouping] = React.useState<TIME_GROUPING>(
        (localStorage.getItem("PlannerBoard-TIME_GROUPING") as TIME_GROUPING) ??
            TIME_GROUPING.ByHours
    );

    React.useEffect(
        () => localStorage.setItem("PlannerBoard-SECOND_INDEX", secondIdx),
        [secondIdx]
    );
    React.useEffect(
        () => localStorage.setItem("PlannerBoard-TIME_GROUPING", timeGrouping),
        [timeGrouping]
    );

    const d_start = localStorage.getItem(
        `PlannerBoard-DATE_START-${schedule.id}`
    );
    const d_end = localStorage.getItem(`PlannerBoard-DATE_END-${schedule.id}`);

    const monthYear = DateFns.parse(schedule.month_year, "MM.yyyy", new Date());
    const [dateRange, setDateRange] = React.useState<DateRange<Date>>([
        d_start ? new Date(d_start) : monthYear,
        d_end ? new Date(d_end) : DateFns.endOfMonth(monthYear),
    ]);

    React.useEffect(
        () =>
            localStorage.setItem(
                `PlannerBoard-DATE_START-${schedule.id}`,
                dateRange[0].toISOString()
            ),
        [dateRange[0].toISOString(), schedule.id]
    );

    React.useEffect(
        () =>
            localStorage.setItem(
                `PlannerBoard-DATE_END-${schedule.id}`,
                dateRange[1].toISOString()
            ),
        [dateRange[1].toISOString(), schedule.id]
    );

    const timeRangeRef = React.useRef(toInterval(dateRange));

    //
    // planner grid by hours
    //

    const timeRange =
        dateRange[0] !== null && dateRange[1] !== null
            ? toInterval(dateRange)
            : timeRangeRef.current;
    timeRangeRef.current = timeRange;

    const employeesInWorkplace = new Set<number>(
        useSelector((state: RootState) =>
            employeeSelectors
                .selectAll(state)
                .filter((e) => e.workplace === schedule.workplace)
                .map((e) => e.id)
        )
    );

    const secondIndexHandler:
        | SecondIndexHandler<Employee>
        | SecondIndexHandler<Role> = React.useMemo(() => {
        return secondIndexDict[timeGrouping][secondIdx](
            schedule,
            employeesInWorkplace
        );
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
                )
                .sort(
                    (lhs, rhs) =>
                        Date.parse(lhs.time_from) - Date.parse(rhs.time_from)
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

    const [runSolverOpen, setRunSolverOpen] = React.useState(false);
    const [clearOpen, setClearOpen] = React.useState(false);

    return (
        <Paper sx={{ p: 3 }}>
            <RunSolverDialog
                open={runSolverOpen}
                setOpen={setRunSolverOpen}
                schedule={schedule}
                days={dateRange}
            />
            <ClearDialog
                open={clearOpen}
                setOpen={setClearOpen}
                schedule={schedule}
            />
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
                <ButtonGroup variant="contained">
                    <Button onClick={() => setRunSolverOpen(true)}>
                        Run solver
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => setClearOpen(true)}
                    >
                        Clear
                    </Button>
                </ButtonGroup>
                <Spacer />
                <DateRangePicker
                    value={dateRange}
                    onChange={(value: DateRange<Date>) =>
                        setDateRange([value[0], DateFns.endOfDay(value[1])])
                    }
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
            schedule: Schedule,
            employeeInWorkplace: Set<number>
        ): SecondIndexHandler<Employee> => {
            const month = parse(schedule.month_year, "MM.yyyy", new Date());
            const interval = {
                start: DateFns.startOfMonth(month),
                end: DateFns.endOfMonth(month),
            };

            return {
                ...getEmployeeSecondIndexHandlerBase(schedule),
                ItemComponent: EmployeeItemByHours,
                limitedAvailabilitySelector: (state: RootState) =>
                    limitedAvailabilitySelectors
                        .selectAll(state)
                        .filter((la) => {
                            const parsed = parse(
                                la.date,
                                "yyyy-MM-dd",
                                new Date()
                            );

                            return (
                                DateFns.isWithinInterval(parsed, interval) &&
                                employeeInWorkplace.has(la.employee)
                            );
                        }),
            };
        },
        [SECOND_INDEX.Role]: (
            schedule: Schedule,
            employeeInWorkplace: Set<number>
        ): SecondIndexHandler<Role> => ({
            ...getRoleSecondIndexHandlerBase(schedule),
            ItemComponent: RoleItemByHours,
        }),
    },
    [TIME_GROUPING.ByDays]: {
        [SECOND_INDEX.Employee]: (
            schedule: Schedule,
            employeeInWorkplace: Set<number>
        ): SecondIndexHandler<Employee> => ({
            ...getEmployeeSecondIndexHandlerBase(schedule),
            ItemComponent: EmployeeItemByDays,
        }),
        [SECOND_INDEX.Role]: (
            schedule: Schedule,
            employeeInWorkplace: Set<number>
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

interface ClearDialogProps {
    schedule: Schedule;
    setOpen: (b: boolean) => void;
    open: boolean;
}

const ClearDialog = ({ schedule, open, setOpen }: ClearDialogProps) => {
    const closeCallback = React.useCallback(() => setOpen(false), [setOpen]);
    const dispatch = useDispatch();
    const agreeCallback = React.useCallback(() => {
        dispatch(clearShiftsForSchedule(schedule.id));
        setOpen(false);
    }, [schedule.id]);

    return (
        <Dialog open={open} onClose={closeCallback}>
            <DialogTitle>{"Clearing shifts"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        "Are you sure you want to clear all shifts from this schedule?"
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCallback}>Close</Button>
                <Button onClick={agreeCallback} autoFocus color="secondary">
                    Clear
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface RunSolverDialogProps {
    schedule: Schedule;
    days: Date[];
    setOpen: (b: boolean) => void;
    open: boolean;
}

const RunSolverDialog = ({
    schedule,
    days,
    open,
    setOpen,
}: RunSolverDialogProps) => {
    const closeCallback = React.useCallback(() => setOpen(false), [setOpen]);
    const dispatch = useDispatch();
    const agreeCallback = React.useCallback(() => {
        const days_ = DateFns.eachDayOfInterval({
            start: days[0],
            end: days[1],
        }).filter((d) => !DateFns.isWeekend(d));

        dispatch(runSolverDefault(schedule.id, days_));
        setOpen(false);
    }, [dispatch, days[0]?.getTime(), days[1]?.getTime(), schedule.id]);

    return (
        <Dialog open={open} onClose={closeCallback}>
            <DialogTitle>{"Running solver"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {
                        "Are you sure you want to run solver? This will not take into account existing shifts!"
                    }
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeCallback}>Close</Button>
                <Button onClick={agreeCallback} autoFocus>
                    Run
                </Button>
            </DialogActions>
        </Dialog>
    );
};
