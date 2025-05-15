/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type CoachUpdateFormInputValues = {
    name?: string;
};
export declare type CoachUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type CoachUpdateFormOverridesProps = {
    CoachUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type CoachUpdateFormProps = React.PropsWithChildren<{
    overrides?: CoachUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    coach?: any;
    onSubmit?: (fields: CoachUpdateFormInputValues) => CoachUpdateFormInputValues;
    onSuccess?: (fields: CoachUpdateFormInputValues) => void;
    onError?: (fields: CoachUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: CoachUpdateFormInputValues) => CoachUpdateFormInputValues;
    onValidate?: CoachUpdateFormValidationValues;
} & React.CSSProperties>;
export default function CoachUpdateForm(props: CoachUpdateFormProps): React.ReactElement;
