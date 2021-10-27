import * as React from "react";
import { batch, useDispatch } from "react-redux";
import { PayloadAction } from "@reduxjs/toolkit";

interface Props {
    timeout: number;
}

const DispatchBatcherProvider = ({
    timeout,
    children,
}: React.PropsWithChildren<Props>) => {
    const context = React.useRef({
        batching: false,
        timeout,
        actions: [],
    });

    return (
        <DispatchBatcherContext.Provider value={context.current}>
            {children}
        </DispatchBatcherContext.Provider>
    );
};

export default DispatchBatcherProvider;

interface DispatchBatcherContextValueType {
    batching: boolean;
    timeout: number;
    actions: PayloadAction<any>[];
}

const DispatchBatcherContext =
    React.createContext<DispatchBatcherContextValueType>({
        batching: false,
        timeout: 500,
        actions: [],
    });

export const useBatchedDispatch = () => {
    const context = React.useContext(DispatchBatcherContext);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (!context.batching) {
            context.batching = true;
            const interval = setInterval(() => {
                if (context.actions.length === 0) {
                    return;
                }

                batch(() => {
                    for (const action of context.actions) {
                        dispatch(action);
                    }
                });
                context.actions = [];
            }, context.timeout);

            return () => {
                context.batching = false;
                clearInterval(interval);
            };
        }
    });

    return (action: PayloadAction<any>) => context.actions.push(action);
};
