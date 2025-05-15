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
export declare type PlayerUpdateFormInputValues = {
    name?: string;
};
export declare type PlayerUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PlayerUpdateFormOverridesProps = {
    PlayerUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type PlayerUpdateFormProps = React.PropsWithChildren<{
    overrides?: PlayerUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    player?: any;
    onSubmit?: (fields: PlayerUpdateFormInputValues) => PlayerUpdateFormInputValues;
    onSuccess?: (fields: PlayerUpdateFormInputValues) => void;
    onError?: (fields: PlayerUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PlayerUpdateFormInputValues) => PlayerUpdateFormInputValues;
    onValidate?: PlayerUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PlayerUpdateForm(props: PlayerUpdateFormProps): React.ReactElement;
