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
import { Role, roleSelectors, updateRole } from "../../roles/rolesSlice";
import { addAlert } from "../../alerts/alertsSlice";
import { EventTypes, CallbackTypes } from "./EventTypes";
import { useSlot } from "../../eventProvider/EventProvider";
import { Shift } from "../../shifts/shiftSlice";
import GenericForm from "../../genericForm/GenericForm";

interface Props {}

const UpdateRoleDialog = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [roleId, setRoleId] = React.useState<number>(null);

    const updateRoleCallback: CallbackTypes.ROLE_UPDATE = ({ roleId }) => {
        setRoleId(roleId);
        setOpen(true);
    };

    useSlot(EventTypes.ROLE_UPDATE, updateRoleCallback, [setRoleId, setOpen]);

    const role = useSelector((state: RootState) =>
        roleSelectors.selectById(state, roleId)
    );

    return role ? (
        <UpdateRoleDialogImpl role={role} open={open} setOpen={setOpen} />
    ) : (
        <React.Fragment />
    );
};

export default UpdateRoleDialog;

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
                message: `Successfully updated a shift: ${id}`,
            })
        );
    };

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
                <Button color="secondary">Delete (NYI)</Button>
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
