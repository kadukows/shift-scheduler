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
        intervalRef: null,
        timeout,
        actions: [],
    });

    const dispatch = useDispatch();

    React.useEffect(() => {
        return () => {
            if (context.current.intervalRef !== null) {
                stopBatchin(context.current, dispatch);
            }
        };
    }, []);

    return (
        <DispatchBatcherContext.Provider value={context.current}>
            {children}
        </DispatchBatcherContext.Provider>
    );
};

export default DispatchBatcherProvider;

type TimerRef = ReturnType<typeof setInterval>;
type Dispatch = ReturnType<typeof useDispatch>;

interface DispatchBatcherContextValueType {
    intervalRef: TimerRef;
    timeout: number;
    actions: PayloadAction<any>[];
}

const DispatchBatcherContext =
    React.createContext<DispatchBatcherContextValueType>({
        intervalRef: null,
        timeout: 500,
        actions: [],
    });

export const useBatchedDispatch = () => {
    const context = React.useContext(DispatchBatcherContext);

    return (action: PayloadAction<any>) => context.actions.push(action);
};

export const useBatchingContext = () => {
    const context = React.useContext(DispatchBatcherContext);
    return context;
};

export const startBatching = (
    context: DispatchBatcherContextValueType,
    dispatch: Dispatch
) => {
    if (context.intervalRef === null) {
        console.log("Batching started");

        context.intervalRef = setInterval(() => {
            if (context.actions.length === 0) {
                return;
            }

            batch(() => {
                for (const action of context.actions) {
                    dispatch(action);
                }

                context.actions = [];
            });
        }, context.timeout);
    }
};

export const stopBatchin = (
    context: DispatchBatcherContextValueType,
    dispatch: Dispatch
) => {
    if (context.intervalRef !== null) {
        console.log("Batching end");

        batch(() => {
            for (const action of context.actions) {
                dispatch(action);
            }

            context.actions = [];
        });

        clearInterval(context.intervalRef);
        context.intervalRef = null;
    }
};
