import * as yup from "yup";
import { FormState, UseFormRegister } from "react-hook-form";

export type StringYupValidationBuilderObject = ReturnType<typeof yup["string"]>;
export type NumberYupValidationBuilderObject = ReturnType<typeof yup["number"]>;

export interface BaseFieldProps<Inputs> {
    errors: FormState<Inputs>["errors"];
    register: UseFormRegister<Inputs>;
    isSubmitting: boolean;
}
