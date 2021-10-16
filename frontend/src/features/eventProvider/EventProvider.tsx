import * as React from "react";

type StringToFunctions = {
    [n: string]: ((...a: any) => void)[];
};

/**
 *
 */

export interface EventContextValueType {
    eventToCallbacks: StringToFunctions;
    setEventToCallbacks: (a: StringToFunctions) => void;
}

const initialValue: EventContextValueType = {
    eventToCallbacks: {},
    setEventToCallbacks: (a) => {},
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
    const [eventToCallbacks, setEventToCallbacks] = React.useState(
        generateInitialStringToFunctionsMap(events)
    );

    return (
        <EventContext.Provider
            value={{ eventToCallbacks, setEventToCallbacks }}
        >
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

export const useSlot = (event: string, callback: (...a: any) => void) => {
    const { eventToCallbacks, setEventToCallbacks } =
        React.useContext(EventContext);

    React.useEffect(() => {
        if (event in eventToCallbacks) {
            setEventToCallbacks({
                ...eventToCallbacks,
                [event]: [...eventToCallbacks[event], callback],
            });

            return () =>
                setEventToCallbacks({
                    ...eventToCallbacks,
                    [event]: eventToCallbacks[event].filter(
                        (el) => el != callback
                    ),
                });
        } else {
            console.warn("useSlot(): event unknown: ", event);
        }
    }, []);
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
