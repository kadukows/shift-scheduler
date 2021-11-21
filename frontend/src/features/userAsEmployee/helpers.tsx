import { useDispatch, batch } from "react-redux";
import { getRoles } from "./role/roleSlice";
import { getSchedules } from "./schedule/scheduleSlice";
import { getShifts } from "./shift/shiftSlice";
import { getWorkplaces } from "./workplace/workplaceSlice";

type DispatchType = ReturnType<typeof useDispatch>;

export const refreshEmployeeData = (dispatch: DispatchType) => {
    batch(() => {
        dispatch(getSchedules() as any);
        dispatch(getShifts() as any);
        dispatch(getRoles() as any);
        dispatch(getWorkplaces() as any);
    });
};
