import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import Loader from "../../loader/Loader";
import EmployeeWidget from "./EmployeeWidget";

const WorkplacePage = () => {
    return (
        <Loader useSlice={useSlice} precondition={pred}>
            <EmployeeWidget />
        </Loader>
    );
};

export default WorkplacePage;

/**
 *
 */

const useSlice = () => {
    return useSelector(
        (state: RootState) =>
            state.employee_workplaceReducer.loaded &&
            state.employee_employeeReducer.loaded
    );
};
const pred = (b: boolean) => b;
