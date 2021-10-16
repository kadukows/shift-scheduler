import * as React from "react";

type StringToFunctions = {
    [n: string]: ((...a: any) => void)[];
};

/**
 *
 */

enum EventProviderActionKind {
    ADD_CALLBACK = "ADD_CALLBACK",
    REMOVE_CALLBACK = "REMOVE_CALLBACK",
}

interface EventProviderAction {
    type: EventProviderActionKind;
    payload: {
        event: string;
        callback: (...a: any) => void;
    };
}

type EventProviderState = StringToFunctions;

function eventProviderReducer(
    state: EventProviderState,
    action: EventProviderAction
) {
    const {
        type,
        payload: { event, callback },
    } = action;
    switch (type) {
        case EventProviderActionKind.ADD_CALLBACK:
            return {
                ...state,
                [event]: [...state[event], callback],
            };
        case EventProviderActionKind.REMOVE_CALLBACK:
            return {
                ...state,
                [event]: state[event].filter((el) => el !== callback),
            };
        default:
            return state;
    }
}

/**
 *
 */

export interface EventContextValueType {
    eventToCallbacks: StringToFunctions;
    dispatch: React.Dispatch<EventProviderAction>;
}

const initialValue: EventContextValueType = {
    eventToCallbacks: {},
    dispatch: null,
};

const EventContext = React.createContext(initialValue);

/**
 *
 */

interface PropsBase {
    events: string[];
}

type Props = React.PropsWithChildren<PropsBase>;

function EventProvider({ children, events }: Props) {
    const [state, dispatch] = React.useReducer(
        eventProviderReducer,
        generateInitialStringToFunctionsMap(events)
    );

    return (
        <EventContext.Provider value={{ eventToCallbacks: state, dispatch }}>
            {children}
        </EventContext.Provider>
    );
}

export default EventProvider;

/**
 * Custom hooks for use with EventProvider
 */

export const useSignal = (event: string) => {
    const { eventToCallbacks } = React.useContext(EventContext);

    if (event in eventToCallbacks) {
        return (...args: any[]) => {
            for (const callback of eventToCallbacks[event]) {
                callback(...args);
            }
        };
    } else {
        console.warn("useSignal(): event unknown: ", event);
        return (...args: any[]) => {};
    }
};

export const useSlot = (
    event: string,
    callback: (...a: any) => void,
    depends: React.DependencyList = []
) => {
    const { eventToCallbacks, dispatch } = React.useContext(EventContext);

    React.useEffect(() => {
        if (event in eventToCallbacks) {
            dispatch({
                type: EventProviderActionKind.ADD_CALLBACK,
                payload: {
                    event,
                    callback,
                },
            });

            return () =>
                dispatch({
                    type: EventProviderActionKind.REMOVE_CALLBACK,
                    payload: {
                        event,
                        callback,
                    },
                });
        } else {
            console.warn("useSlot(): event unknown: ", event);
        }
    }, depends);
};

/**
 * helper functions
 */

const generateInitialStringToFunctionsMap = (events: string[]) => {
    const result: StringToFunctions = {};
    for (const event of events) {
        result[event] = [];
    }
    return result;
};
