import * as React from "react";
import { Button } from "@mui/material";
import { EventTypes, CallbackTypes } from "./EventTypes";
import { useSignal } from "../../eventProvider/EventProvider";

interface Props {}

const AddNewButton = (props: Props) => {
    const signal: CallbackTypes.ROLE_ADD = useSignal(EventTypes.ROLE_ADD);

    return (
        <Button variant="contained" color="primary" onClick={signal}>
            Add New
        </Button>
    );
};

export default AddNewButton;
