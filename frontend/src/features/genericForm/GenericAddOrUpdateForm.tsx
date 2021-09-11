import * as React from "react";
import axios, { AxiosResponse } from "axios";
import { useSelector } from "react-redux";

import GenericForm from "./GenericForm";
import { FieldData } from "./fieldInstance/Field";
import { RootState } from "../../store";
import { getTokenRequestConfig, WithId } from "../helpers";

interface Props<
    Inputs,
    EntityToAdd extends WithId & Inputs,
    EntityOnFields extends WithId
> {
    fields: FieldData<Inputs, EntityOnFields>[];
    baseUrl: string;
    onSubmitted: (entity: EntityToAdd) => void;
    formId: string;
    objectToModify?: EntityToAdd;
}

const GenericAddOrUpdateForm = <
    Inputs extends unknown,
    EntityToAdd extends WithId & Inputs,
    EntityOnFields extends WithId
>({
    fields,
    baseUrl,
    formId,
    objectToModify,
    onSubmitted,
}: Props<Inputs, EntityToAdd, EntityOnFields>) => {
    const auth = useSelector((state: RootState) => state.authReducer);

    const submit = async (inputs: Inputs) => {
        let res: AxiosResponse<EntityToAdd> = null;

        if (!objectToModify) {
            res = await axios.post<EntityToAdd>(
                baseUrl,
                inputs,
                getTokenRequestConfig(auth.token)
            );
        } else {
            res = await axios.put<EntityToAdd>(
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
