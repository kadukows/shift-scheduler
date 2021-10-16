import * as React from "react";
import { Employee } from "../../employees/employeeSlice";

import { useSlot } from "../../eventProvider/EventProvider";
import EventTypes, { CallbackTypes } from "../EventTypes";

interface Props {}

const ClickedEmptyFieldWithEmployeeWidget = (props: Props) => {
    const [date, setDate] = React.useState<Date>(null);
    const [employee, setEmployee] = React.useState<Employee>(null);

    useSlot(EventTypes.EMPTY_FIELD_W_EMPLOYEE_CLICKED, ((
        date: Date,
        employee: Employee
    ) => {
        setDate(date);
        setEmployee(employee);
    }) as CallbackTypes.EMPTY_FIELD_W_EMPLOYEE_CLICKED);

    return (
        <p>
            Date: {date ? date.toISOString() : "null"}, employee:{" "}
            {employee ? employee.first_name + " " + employee.last_name : "null"}
        </p>
    );
};

export default ClickedEmptyFieldWithEmployeeWidget;
