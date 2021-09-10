import * as React from "react";
import axios from "axios";
import { Typography } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";

import { removeWorkplaces, workplaceSelectors } from "../workplaceSlice";
import { getTokenRequestConfig } from "../../helpers";
import { RootState } from "../../../store";
import { addAlert } from "../../alerts/alertsSlice";

export interface Inputs {
    ids: number[];
}

interface Props {
    formId: string;
    submit: (a: Inputs) => void;
    ids: number[];
}

const WorkplaceDeleteForm = ({ formId, submit, ids }: Props) => {
    const workplaces = useSelector(workplaceSelectors.selectEntities);
    const dispatch = useDispatch();
    const auth = useSelector((state: RootState) => state.authReducer);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        submit({ ids });
    };

    return (
        <form id={formId} onSubmit={handleSubmit}>
            Are you sure you want to delete:{" "}
            {ids.map((id) => workplaces[id].name).join()}?
        </form>
    );
};

export default WorkplaceDeleteForm;
