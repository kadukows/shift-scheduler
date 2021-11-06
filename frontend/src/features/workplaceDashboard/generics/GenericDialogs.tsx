import * as React from "react";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { useSlot } from "../../eventProvider/EventProvider";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import GenericForm from "../../genericForm/GenericForm";

type DispatchType = ReturnType<typeof useDispatch>;

export type SubmitType<Inputs, Item> = (
    dispatch: DispatchType,
    item: Item,
    token: string
) => (inputs: Inputs) => void;

export type OnDeleteType = (
    dispatch: DispatchType,
    itemId: number,
    token: string
) => void;

interface GenericUpdateDialogBaseProps<Item, Inputs> {
    submit: SubmitType<Inputs, Item>;
    onDelete: OnDeleteType;
    getDefaultValues: (item: Item) => any;
    title: string;
    fields: FieldData<Inputs, any>[];
    formId?: string;
}

interface GenericUpdateDialogProps<CallbackArgType, Item, Inputs>
    extends GenericUpdateDialogBaseProps<Item, Inputs> {
    getItemId: (a: CallbackArgType) => number;
    itemSelector: (itemId: number) => (state: RootState) => Item;
    eventType: string;
}

export const GenericUpdateDialog = <
    CallbackArgType,
    Item extends { id: number },
    Inputs
>({
    getItemId,
    itemSelector,
    eventType,
    ...rest
}: GenericUpdateDialogProps<CallbackArgType, Item, Inputs>) => {
    const [open, setOpen] = React.useState(false);
    const [itemId, setItemId] = React.useState<number>(null);

    useSlot(
        eventType,
        (a: CallbackArgType) => {
            setItemId(getItemId(a));
            setOpen(true);
        },
        [getItemId, setOpen, setItemId]
    );

    const item = useSelector(itemSelector(itemId));

    return item ? (
        <GenericUpdateDialogImpl
            item={item}
            open={open}
            setOpen={setOpen}
            {...rest}
        />
    ) : (
        <React.Fragment />
    );
};

/**
 *
 */

interface GenericUpdateDialogImplProps<Item, Inputs>
    extends GenericUpdateDialogBaseProps<Item, Inputs> {
    item: Item;
    open: boolean;
    setOpen: (a: boolean) => void;
}

const FORM_ID = "GHAGIUH324Y83294YH";

const GenericUpdateDialogImpl = <Item extends { id: number }, Inputs>({
    item,
    submit,
    open,
    setOpen,
    title,
    fields,
    formId,
    onDelete,
    getDefaultValues,
}: GenericUpdateDialogImplProps<Item, Inputs>) => {
    const workplaceId = useWorkplaceId();
    const token = useSelector((state: RootState) => state.authReducer.token);
    const dispatch = useDispatch();

    const memoSubmit = React.useMemo(
        () => async (inputs: Inputs) => {
            const asyncSubmit = submit(dispatch, item, token);
            await asyncSubmit(inputs);
            setOpen(false);
        },
        [workplaceId, submit, dispatch, item, token, setOpen]
    );

    const nanoIdRef = React.useRef<string>(nanoid());
    const formIdProcessed = formId ?? nanoIdRef.current;

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <GenericForm
                    submit={memoSubmit}
                    fields={fields}
                    formId={formIdProcessed}
                    defaultValues={getDefaultValues(item)}
                />
            </DialogContent>
            <DialogActions>
                <Button
                    color="secondary"
                    onClick={() => onDelete(dispatch, item.id, token)}
                >
                    Delete
                </Button>
                <div style={{ flex: 1 }} />
                <Button onClick={() => setOpen(false)}>Close</Button>
                <Button type="submit" form={formIdProcessed}>
                    Update
                </Button>
            </DialogActions>
        </Dialog>
    );
};
