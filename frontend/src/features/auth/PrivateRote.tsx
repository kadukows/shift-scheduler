import * as React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";

import { RootState } from "../../store";
import { BaseAlert } from "../alerts/alertsSlice";
import Loader from "../loader/Loader";
import RedirectWithAlert from "../alerts/RedirectWithAlert";

interface Props extends React.ComponentProps<typeof Route> {
    inverse?: boolean;
    previousPage?: string;
    name?: string;
    noAlert?: boolean;
    path: string;
}

function PrivateRoute({
    inverse,
    name,
    previousPage,
    children,
    noAlert,
    ...rest
}: React.PropsWithChildren<Props>): React.ReactElement {
    const useSlice = () => useSelector((state: RootState) => state.authReducer);
    const authIsLoaded = (state: RootState["authReducer"]) => state.loaded;
    const auth = useSelector((state: RootState) => state.authReducer);

    const passed = !inverse ? auth.authenticated : !auth.authenticated;

    let RedirectComponent: any;
    if (!noAlert) {
        const redirectAlert: BaseAlert = {
            type: "warning",
            message: `You need to be ${
                !inverse ? "logged in" : "logged out"
            } in order to access ${name ? `"${name}"` : "that"} page.`,
        };

        RedirectComponent = (
            props: Omit<React.ComponentProps<typeof RedirectWithAlert>, "alert">
        ) => <RedirectWithAlert alert={redirectAlert} {...props} />;
    } else {
        RedirectComponent = (props: React.ComponentProps<typeof Redirect>) => (
            <Redirect {...props} />
        );
    }

    const to = previousPage ? previousPage : "/";

    return (
        <Route {...rest}>
            <Loader useSlice={useSlice} precondition={authIsLoaded}>
                {passed ? children : <RedirectComponent to={to} />}
            </Loader>
        </Route>
    );
}

export default PrivateRoute;
