import * as React from "react";
import * as yup from "yup";
import axios from "axios";
import {
    Dialog,
    DialogActions,
    DialogTitle,
    DialogContent,
    Button,
    Box,
} from "@mui/material";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { nanoid } from "@reduxjs/toolkit";
import { RootState } from "../../../store";
import { useSlot } from "../../eventProvider/EventProvider";
import { useWorkplaceId } from "../../workplaces/WorkplaceProvider";
import { FieldData } from "../../genericForm/fieldInstance/Field";
import GenericForm from "../../genericForm/GenericForm";
import { CallbackTypes, EventTypes } from "./EventTypes";
import {
    LA_Type,
    LimitedAvailability,
    limitedAvailabilityActions,
} from "../../limitedAvailability/limitedAvailablitySlice";
import {
    ShiftTemplate,
    shiftTemplateSelectors,
} from "../../shiftTemplates/shiftTemplates";
import { ChooseObjectIdFieldData } from "../../genericForm/fieldInstance/ChooseObjectIdField";
import { MANAGER_API_ROUTES } from "../../../ApiRoutes";
import { getTokenRequestConfig } from "../../helpers";
import { addAlert } from "../../alerts/alertsSlice";

interface Props {}

const CreateEmployeeAvailabilityDialog = (props: Props) => {
    const [open, setOpen] = React.useState(false);
    const [callbackVal, setCallbackVal] =
        React.useState<CallbackTypes.EMPLOYEE_AVAILABILITY_ADD_ARG_TYPE>({
            employeeId: null,
            date: new Date(),
        });

    const slotCallback: CallbackTypes.EMPLOYEE_AVAILABILITY_ADD = (arg) => {
        setCallbackVal(arg);
        setOpen(true);
    };
    useSlot(EventTypes.EMPLOYEE_AVAILABILITY_ADD, slotCallback, [
        setCallbackVal,
        setOpen,
    ]);

    const dispatch = useDispatch();
    const token = useSelector((state: RootState) => state.authReducer.token);

    const submit = React.useCallback(
        async ({ la_type, shift_templates }: Inputs) => {
            //console.log(la_type, shift_templates);
            //console.log(callbackVal);
            const res = await axios.post<LimitedAvailability>(
                MANAGER_API_ROUTES.limitedAvailability,
                {
                    la_type,
                    shift_templates,
                    employee: callbackVal.employeeId,
                    date: format(callbackVal.date, "yyyy-MM-dd"),
                },
                getTokenRequestConfig(token)
            );

            dispatch(limitedAvailabilityActions.addOne(res.data));
            dispatch(
                addAlert({
                    type: "info",
                    message: `Successfully added an availability: ${res.data.id}`,
                })
            );
            setOpen(false);
        },
        [callbackVal.employeeId, callbackVal.date.getTime(), token, dispatch]
    );

    return (
        <Dialog open={open} onClose={() => setOpen(false)}>
            <Box sx={{ width: 300 }}>
                <DialogTitle>Availability</DialogTitle>
                <DialogContent>
                    <GenericForm
                        submit={submit}
                        fields={fields}
                        formId="CREATEEMPLOYEEAVAILABILITYDIALOG"
                        defaultValues={{
                            shift_templates: [],
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Box sx={{ width: 200 }} />
                    <Button onClick={() => setOpen(false)}>Close</Button>
                    <Button
                        type="submit"
                        form="CREATEEMPLOYEEAVAILABILITYDIALOG"
                    >
                        Create
                    </Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
};

export default CreateEmployeeAvailabilityDialog;

interface Inputs {
    la_type: LA_Type;
    shift_templates: number[];
}

const fields: FieldData<Inputs, any>[] = [
    {
        type: "choose_object",
        name: "la_type",
        label: "Type",
        validation: yup.string().required(),

        entitySelector: () => [LA_Type.FreeDay, LA_Type.Preference],
        entityToString: (la_type: LA_Type) => {
            switch (la_type) {
                case LA_Type.FreeDay:
                    return "Free Day";
                case LA_Type.Preference:
                    return "No Full Day";
            }

            return "";
        },
        entityGetId: (la: LA_Type) => la,
    } as ChooseObjectIdFieldData<Inputs, LA_Type>,
    {
        type: "choose_object",
        name: "shift_templates",
        label: "Shift templates",
        validation: yup.array().of(yup.number().required()),

        entitySelector: shiftTemplateSelectors.selectAll,
        entityToString: (st: ShiftTemplate) =>
            `${st.time_from} -- ${st.time_to}`,

        multiple: true,
    } as ChooseObjectIdFieldData<Inputs, ShiftTemplate>,
];
