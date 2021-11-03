import * as React from "react";

interface Props {
    workplaceId: number;
}

const WorkplaceProvider = ({
    workplaceId,
    children,
}: React.PropsWithChildren<Props>) => {
    return (
        <WorkplaceContext.Provider value={{ workplaceId }}>
            {children}
        </WorkplaceContext.Provider>
    );
};

export default WorkplaceProvider;

/**
 *
 */

interface WorkplaceContextValueType {
    workplaceId: number;
}

const WorkplaceContext = React.createContext<WorkplaceContextValueType>({
    workplaceId: null,
});

export const useWorkplaceId = () => {
    const context = React.useContext(WorkplaceContext);
    return context.workplaceId;
};
