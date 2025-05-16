/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SelectFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type DraftUpdateFormInputValues = {
    name?: string;
    phase?: string;
    draftOrder?: string[];
    createdAt?: string;
    updatedAt?: string;
};
export declare type DraftUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
    phase?: ValidationFunction<string>;
    draftOrder?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type DraftUpdateFormOverridesProps = {
    DraftUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    phase?: PrimitiveOverrideProps<SelectFieldProps>;
    draftOrder?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type DraftUpdateFormProps = React.PropsWithChildren<{
    overrides?: DraftUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    draft?: any;
    onSubmit?: (fields: DraftUpdateFormInputValues) => DraftUpdateFormInputValues;
    onSuccess?: (fields: DraftUpdateFormInputValues) => void;
    onError?: (fields: DraftUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: DraftUpdateFormInputValues) => DraftUpdateFormInputValues;
    onValidate?: DraftUpdateFormValidationValues;
} & React.CSSProperties>;
export default function DraftUpdateForm(props: DraftUpdateFormProps): React.ReactElement;
