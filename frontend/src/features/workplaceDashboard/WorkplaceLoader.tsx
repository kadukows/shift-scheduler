import * as React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import Loader from "../loader/Loader";

const WorkplaceLoader = ({ children }: React.PropsWithChildren<{}>) => {
    const useSlice = () =>
        useSelector((state: RootState) => state.workplaceReducer.loaded);
    const predicate = (loaded: boolean) => loaded;

    return (
        <Loader useSlice={useSlice} precondition={predicate}>
            {children}
        </Loader>
    );
};

export default WorkplaceLoader;
