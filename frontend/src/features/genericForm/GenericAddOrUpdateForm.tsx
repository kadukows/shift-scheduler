import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSelector } from "react-redux";

import GenericForm, { Field } from "./GenericForm";
import { RootState } from "../../store";
import { getTokenRequestConfig } from "../helpers";

interface HasId {
    id: number;
}

interface Props<Inputs, Entity> {
    fields: Field<Inputs>[];
    baseUrl: string;
    onSubmitted: (entity: Entity) => void;
    formId: string;
    objectToModify?: Entity;
}

const GenericAddOrUpdateForm = <
    Inputs extends unknown,
    Entity extends HasId & Inputs
>({
    fields,
    baseUrl,
    formId,
    objectToModify,
    onSubmitted,
}: Props<Inputs, Entity>) => {
    const auth = useSelector((state: RootState) => state.authReducer);

    const submit = async (inputs: Inputs) => {
        let res: AxiosResponse<Entity> = null;

        if (!objectToModify) {
            res = await axios.post<Entity>(
                baseUrl,
                inputs,
                getTokenRequestConfig(auth.token)
            );
        } else {
            res = await axios.put<Entity>(
                `${baseUrl}${objectToModify.id}/`,
                inputs,
                getTokenRequestConfig(auth.token)
            );
        }

        onSubmitted(res.data);
    };

    return (
        <GenericForm
            fields={fields}
            submit={submit}
            formId={formId}
            defaultValues={objectToModify}
        />
    );
};

export default GenericAddOrUpdateForm;
