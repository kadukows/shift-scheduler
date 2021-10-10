import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../loader/Loader";
import PlannerPage from "./PlannerPage";

interface Props {}

const PlannerLoader = (props: Props) => {
    const useSlice = () => useSelector((state: RootState) => state);
    const predicate = (state: ReturnType<typeof useSlice>) =>
        state.scheduleReducer.loaded &&
        state.workplaceReducer.loaded &&
        state.shiftReducer.loaded &&
        state.employeeReducer.loaded &&
        state.roleReducer.loaded;

    return (
        <Loader useSlice={useSlice} precondition={predicate}>
            <PlannerPage />
        </Loader>
    );
};

export default PlannerLoader;
