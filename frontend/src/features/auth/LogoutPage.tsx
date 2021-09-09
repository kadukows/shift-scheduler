import * as React from "react";
import { useDispatch } from "react-redux";

import { resetAuth } from "../auth/authSlice";
import RedirectWithAlert from "../alerts/RedirectWithAlert";

const LogoutPage = () => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(resetAuth());
    }, []);

    return (
        <RedirectWithAlert
            to="/"
            alert={{
                type: "info",
                message: "You have been logged out.",
            }}
        />
    );
};

export default LogoutPage;
