import * as yup from "yup";
import { FormState, UseFormRegister } from "react-hook-form";

export type StringYupValidationBuilderObject = ReturnType<typeof yup["string"]>;

export interface BaseFieldProps<Inputs> {
    errors: FormState<Inputs>["errors"];
    register: UseFormRegister<Inputs>;
    isSubmitting: boolean;
}
