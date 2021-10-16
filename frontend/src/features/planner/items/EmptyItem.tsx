import * as React from "react";
import { Employee } from "../../employees/employeeSlice";

import { useSignal } from "../../eventProvider/EventProvider";
import EventTypes, { CallbackTypes } from "../EventTypes";
import ItemBase from "./ItemBase";
import { Indices, EmployeeIndices } from "./ItemFactory";

import "./style.css";

interface Props {
    indices: Indices;
}

const EmptyItem = ({ indices }: Props) => {
    const indices2 = indices as EmployeeIndices;

    const sendDateEmployee = useSignal(
        EventTypes.EMPTY_FIELD_W_EMPLOYEE_CLICKED
    ) as CallbackTypes.EMPTY_FIELD_W_EMPLOYEE_CLICKED;

    return (
        <ItemBase
            className="planner-items-hoverable"
            onClick={() => sendDateEmployee(indices.date, indices2.employee)}
        />
    );
};

export default EmptyItem;
