import * as React from "react";

type StringToFunctions = {
    [n: string]: ((...a: any) => void)[];
};

/**
 *
 */

export interface EventContextValueType {
    eventToCallbacks: StringToFunctions;
}

const initialValue: EventContextValueType = {
    eventToCallbacks: {},
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
    const state = React.useRef<StringToFunctions>(
        generateInitialStringToFunctionsMap(events)
    );

    return (
        <EventContext.Provider value={{ eventToCallbacks: state.current }}>
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
    const result = React.useCallback(
        (...args: any[]) => {
            for (const callback of eventToCallbacks[event]) {
                callback(...args);
            }
        },
        [eventToCallbacks, event]
    );

    if (event in eventToCallbacks) {
        return result;
    } else {
        console.warn("useSignal(): event unknown: ", event);
        return (...args: any[]) => {};
    }
};

export const useSlot = <CallbackType extends (...a: any[]) => void>(
    event: string,
    callback: (...a: any) => void,
    depends: React.DependencyList = []
) => {
    const { eventToCallbacks } = React.useContext(EventContext);

    React.useEffect(() => {
        if (event in eventToCallbacks) {
            eventToCallbacks[event].push(callback);

            return () => {
                eventToCallbacks[event] = eventToCallbacks[event].filter(
                    (el) => el !== callback
                );
            };
        } else {
            console.warn("useSlot(): event unknown: ", event);
        }
    }, [event, ...depends]);
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
