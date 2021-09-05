import * as React from "react";
import { useDispatch } from "react-redux";
import { tryAuthWithCurrentToken } from "./authSlice";

interface Props {}

const TryAuthWithCurrentToken = (props: Props) => {
    const dispatch = useDispatch();
    React.useEffect(() => {
        dispatch(tryAuthWithCurrentToken());
    }, []);

    return <></>;
};

export default TryAuthWithCurrentToken;
