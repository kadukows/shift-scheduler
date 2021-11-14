import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../loader/Loader";

const WorkplaceLoader = ({ children }: React.PropsWithChildren<{}>) => {
    return (
        <Loader useSlice={useSlice} precondition={predicate}>
            {children}
        </Loader>
    );
};

export default WorkplaceLoader;

const useSlice = () =>
    useSelector(
        (state: RootState) =>
            state.workplaceReducer.loaded && !state.workplaceReducer.loading
    );
const predicate = (loaded: boolean) => loaded;
