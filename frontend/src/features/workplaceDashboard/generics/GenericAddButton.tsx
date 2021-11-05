import * as React from "react";
import { Button } from "@mui/material";
import { useSignal } from "../../eventProvider/EventProvider";

interface Props {
    addEvent: string;
    text?: string;
}

const GenericAddButton = ({ addEvent, text }: Props) => {
    const signal = useSignal(addEvent);

    return (
        <Button color="primary" variant="contained" onClick={signal}>
            {text ?? "Add New"}
        </Button>
    );
};

export default GenericAddButton;
