import * as React from "react";

interface PropsBase {
    events: string[];
}

type Props = React.PropsWithChildren<PropsBase>;

export interface EventContextValueType {
    eventToCallbacks: {
        [n: string]: ((...a: any) => void)[];
    };
}

const initialValue: EventContextValueType = {
    eventToCallbacks: {},
};

const EventContext = React.createContext(initialValue);

function EventProvider({ children, events }: Props) {
    const eventToCallbacks: EventContextValueType["eventToCallbacks"] = {};
    for (const event of events) {
        eventToCallbacks[event] = [];
    }

    const value: EventContextValueType = { eventToCallbacks };

    return (
        <EventContext.Provider value={value}>{children}</EventContext.Provider>
    );
}

export default EventProvider;

export const useSignal = (event: string) => {
    const value = React.useContext(EventContext);

    if (event in value.eventToCallbacks) {
        return (...args: any[]) => {
            for (const callback of value.eventToCallbacks[event]) {
                callback(...args);
            }
        };
    } else {
        console.warn("useSignal(): event unknown: ", event);
        return (...args: any[]) => {};
    }
};

export const useSlot = (event: string, callback: (...a: any) => void) => {
    const value = React.useContext(EventContext);

    React.useEffect(() => {
        if (event in value.eventToCallbacks) {
            value.eventToCallbacks[event].push(callback);
            return () => {
                value.eventToCallbacks[event] = value.eventToCallbacks[
                    event
                ].filter((el) => el != callback);
            };
        } else {
            console.warn("useSlot(): event unknown: ", event);
        }
    }, [callback]);
};
