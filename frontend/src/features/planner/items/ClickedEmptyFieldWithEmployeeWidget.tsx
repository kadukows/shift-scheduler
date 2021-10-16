import * as React from "react";
import { Employee } from "../../employees/employeeSlice";
import { employeeToString } from "../../employees/helpers";

import { useSlot } from "../../eventProvider/EventProvider";
import EventTypes, { CallbackTypes } from "../EventTypes";

interface Props {}

const ClickedEmptyFieldWithEmployeeWidget = (props: Props) => {
    const [date, setDate] = React.useState<Date>(null);
    const [employee, setEmployee] = React.useState<Employee>(null);
    const [isEmptyField, setIsEmptyField] = React.useState(false);

    useSlot(EventTypes.EMPTY_FIELD_CLICKED, ((date, secondIdx, payload) => {
        setDate(date);
        setEmployee(payload as Employee);
        setIsEmptyField(true);
    }) as CallbackTypes.EMPTY_FIELD_CLICKED);

    useSlot(EventTypes.NON_EMPTY_FIELD_CLICKED, ((
        date,
        secondIdx,
        payload,
        shift
    ) => {
        setDate(date);
        setEmployee(payload as Employee);
        setIsEmptyField(false);
    }) as CallbackTypes.NON_EMPTY_FIELD_CLICKED);

    return (
        <p>
            {`Date: ${date}, employee: ${employeeToString(
                employee
            )}, is empty field: ${isEmptyField}`}
        </p>
    );
};

export default ClickedEmptyFieldWithEmployeeWidget;
