import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    DialogActions,
    DialogContent,
    DialogTitle,
    Dialog,
    Button,
} from "@mui/material";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import { Workplace } from "../../workplaces/workplaceSlice";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
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
import { useSlot } from "../../eventProvider/EventProvider";
import { Shift } from "../../shifts/shiftSlice";
import GenericForm from "../../genericForm/GenericForm";
import { GenericUpdateDialog, SubmitType, OnDeleteType } from "../generics";

export const UpdateRoleDialog = () => {
    return (
        <GenericUpdateDialog<CallbackTypes.ROLE_UPDATE_ARG_TYPE, Role, Inputs>
            getItemId={getItemId}
            itemSelector={itemSelector}
            eventType={EventTypes.ROLE_UPDATE}
            submit={submit}
            onDelete={onDelete}
            getDefaultValues={getDefaultValues}
            title="Update Role"
            fields={fields}
        />
    );
};

const getItemId = (arg: CallbackTypes.ROLE_UPDATE_ARG_TYPE) => arg.roleId;

const itemSelector = (roleId: number) => (state: RootState) =>
    roleSelectors.selectById(state, roleId);

const submit: SubmitType<Inputs> =
    (dispatch, workplaceId, token) =>
    async ({ name }: Inputs) => {
        const res = await axios.post<Role>(
            `/api/role/`,
            {
                name,
                workplace: workplaceId,
            },
            getTokenRequestConfig(token)
        );

        dispatch(addRole(res.data));

        dispatch(
            addAlert({
                type: "info",
                message: `Successfully added a role: ${res.data.id}`,
            })
        );
    };

const onDelete: OnDeleteType = async (dispatch, roleId, token) => {
    await axios.delete(`/api/role/${roleId}/`, getTokenRequestConfig(token));

    dispatch(removeRole(roleId));

    dispatch(
        addAlert({
            type: "info",
            message: `Removed a role: ${roleId}`,
        })
    );
};

const getDefaultValues = (role: Role) => ({ name: role.name });

/**
 *
 */

export const AddRoleDialog = () => {
    const [open, setOpen] = React.useState(false);
    const workplaceId = useWorkplaceId();
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();
    useSlot(EventTypes.ROLE_ADD, () => setOpen(true), [setOpen]);

    const submit = async ({ name }: Inputs) => {
        const res = await axios.post<Role>(
            `/api/role/`,
            {
                name,
                workplace: workplaceId,
            },
            getTokenRequestConfig(token)
        );

        dispatch(addRole(res.data));

        dispatch(
            addAlert({
                type: "info",
                message: `Successfully added a role: ${res.data.id}`,
            })
        );

        setOpen(false);
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Add a Role</DialogTitle>
            <DialogContent>
                <GenericForm
                    formId={FORM_ID_ADD_ROLE}
                    fields={fields}
                    submit={submit}
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={() => setOpen(false)}>
                    Close
                </Button>
                <Button color="primary" type="submit" form={FORM_ID_ADD_ROLE}>
                    Create
                </Button>
            </DialogActions>
        </Dialog>
    );
};

/**
 *
 */

interface UpdateRoleDialogImplProps {
    role: Role;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const UpdateRoleDialogImpl = ({
    role,
    open,
    setOpen,
}: UpdateRoleDialogImplProps) => {
    const workplaceId = useWorkplaceId();
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const submit = async ({ name }: Inputs) => {
        const res = await axios.put<Role>(
            `/api/role/${role.id}/`,
            {
                name,
                workplace: workplaceId,
            },
            getTokenRequestConfig(token)
        );

        const { id, ...rest } = res.data;

        dispatch(
            updateRole({
                id: id,
                changes: rest,
            })
        );

        dispatch(
            addAlert({
                type: "info",
                message: `Successfully updated a role: ${id}`,
            })
        );

        setOpen(false);
    };

    const onDelete = React.useMemo(
        () => async () => {
            setOpen(false);

            await axios.delete(
                `/api/role/${role.id}/`,
                getTokenRequestConfig(token)
            );

            dispatch(removeRole(role.id));

            dispatch(
                addAlert({
                    type: "info",
                    message: `Removed a role: ${role.id}`,
                })
            );
        },
        [role.id, token]
    );

    const defaultValues = {
        name: role.name,
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>Update a Role</DialogTitle>
            <DialogContent>
                <GenericForm
                    defaultValues={defaultValues}
                    formId={FORM_ID}
                    fields={fields}
                    submit={submit}
                />
            </DialogContent>
            <DialogActions>
                <Button color="secondary" onClick={onDelete}>
                    Delete
                </Button>

                <div style={{ flex: 1 }} />

                <Button color="primary" onClick={() => setOpen(false)}>
                    Close
                </Button>
                <Button color="primary" type="submit" form={FORM_ID}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};

interface Inputs {
    name: string;
}

const fields: FieldData<Inputs, Workplace>[] = [
    {
        type: "string",
        name: "name",
        label: "Name",
        validation: yup.string().required(),
    },
];

const FORM_ID = "UPDATE_ROLE";
const FORM_ID_ADD_ROLE = "ADD_ROLE";
