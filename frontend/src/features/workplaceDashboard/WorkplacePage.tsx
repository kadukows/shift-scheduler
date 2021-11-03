import * as React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { RootState } from "../../store";
import RedirectWithAlert from "../alerts/RedirectWithAlert";
import Loader from "../loader/Loader";
import WorkplaceProvider from "../workplaces/WorkplaceProvider";
import { workplaceSelectors } from "../workplaces/workplaceSlice";
import WorkplaceDashboard from "./WorkplaceDashboard";

interface Props {}

const WorkplacePage = (props: Props) => {
    const useSlice = () =>
        useSelector((state: RootState) => state.workplaceReducer.loaded);
    const predicate = (loaded: boolean) => loaded;

    return (
        <Loader useSlice={useSlice} precondition={predicate}>
            <WorkplacePageImpl />
        </Loader>
    );
};

export default WorkplacePage;

interface Params {
    workplaceId: string;
}

const WorkplacePageImpl = () => {
    const workplaceId = parseInt(useParams<Params>().workplaceId);
    const workplace = useSelector((state: RootState) =>
        workplaceSelectors.selectById(state, workplaceId)
    );

    if (!workplace) {
        return (
            <RedirectWithAlert
                to="/"
                alert={{
                    type: "warning",
                    message: `Workplace with id "${workplaceId}" not found`,
                }}
            />
        );
    }

    return (
        <WorkplaceProvider workplaceId={workplaceId}>
            <WorkplaceDashboard />
        </WorkplaceProvider>
    );
};
