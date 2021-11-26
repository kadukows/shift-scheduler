import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { getTokenRequestConfig } from "../../helpers";
import {
    addRole,
    removeRole,
    Role,
    roleSelectors,
    updateRole,
} from "../../roles/rolesSlice";
import { addAlert } from "../../alerts/alertsSlice";
import { EventTypes, CallbackTypes } from "./EventTypes";
import {
    GenericUpdateDialog,
    GenericAddDialog,
    GenericAddDialogProps,
    GenericUpdateDialogProps,
} from "../generics";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";

export const UpdateRoleDialog = () => {
    return (
        <GenericUpdateDialog<CallbackTypes.ROLE_UPDATE_ARG_TYPE, Role, Inputs>
            {...UPDATE_ROLE_PROPS}
        />
    );
};

export const AddRoleDialog = () => {
    return <GenericAddDialog {...ADD_ROLE_PROPS} />;
};

interface Inputs {
    name: string;
    priority: number;
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "string",
        name: "name",
        label: "Name",
        validation: yup.string().required(),
    },
    {
        type: "string",
        name: "priority",
        label: "Priority",
        validation: yup.number().required(),
        textFieldProps: {
            type: "number",
        },
    },
];

const ADD_ROLE_PROPS: GenericAddDialogProps<Inputs> = {
    addEvent: EventTypes.ROLE_ADD,
    title: "Add Role",
    fields: fields,
    formId: "ADD_ROLE_WORKPLACE_DASHBOARD_FORM",
    defaultValues: {
        priority: 1,
    },
    useSubmit: () => {
        const workplaceId = useWorkplaceId();

        return React.useCallback(
            (dispatch, token) =>
                async ({ name, priority }) => {
                    const res = await axios.post<Role>(
                        MANAGER_API_ROUTES.role,
                        {
                            name,
                            workplace: workplaceId,
                            priority,
                        },
                        getTokenRequestConfig(token)
                    );

                    dispatch(addRole(res.data));
                    dispatch(
                        addAlert({
                            type: "info",
                            message: `Successfully added a role ${res.data.id}`,
                        })
                    );
                },
            [workplaceId]
        );
    },
};

const UPDATE_ROLE_PROPS: GenericUpdateDialogProps<
    CallbackTypes.ROLE_UPDATE_ARG_TYPE,
    Role,
    Inputs
> = {
    getItemId: (arg) => arg.roleId,
    itemSelector: (itemId) => (state) =>
        roleSelectors.selectById(state, itemId),
    eventType: EventTypes.ROLE_UPDATE,
    title: "Update Role",
    formId: "UPDATE_ROLE_WORKPLACE_DASHBOARD_FORM",
    fields,
    getDefaultValues: (role: Role) => ({
        name: role.name,
        priority: role.priority,
    }),
    submit:
        (dispatch, item, token) =>
        async ({ name, priority }: Inputs) => {
            const res = await axios.put<Role>(
                `${MANAGER_API_ROUTES.role}${item.id}/`,
                {
                    name,
                    workplace: item.workplace,
                    priority,
                },
                getTokenRequestConfig(token)
            );

            const { id, ...rest } = res.data;
            dispatch(
                updateRole({
                    id,
                    changes: rest,
                })
            );

            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully updated a role: ${res.data.id}`,
                })
            );
        },
    onDelete: async (dispatch, roleId, token) => {
        await axios.delete(
            `${MANAGER_API_ROUTES.role}${roleId}/`,
            getTokenRequestConfig(token)
        );

        dispatch(removeRole(roleId));

        dispatch(
            addAlert({
                type: "info",
                message: `Removed a role: ${roleId}`,
            })
        );
    },
};
