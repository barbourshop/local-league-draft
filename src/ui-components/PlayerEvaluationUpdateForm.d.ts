/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, SwitchFieldProps, TextFieldProps } from "@aws-amplify/ui-react";
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
export declare type PlayerEvaluationUpdateFormInputValues = {
    playerId?: number;
    schoolGrade?: number;
    overallRank?: string;
    offenseRank?: string;
    defenseRank?: string;
    slottedRound?: number;
    firstTimePlayer?: boolean;
    clubPlayer?: boolean;
};
export declare type PlayerEvaluationUpdateFormValidationValues = {
    playerId?: ValidationFunction<number>;
    schoolGrade?: ValidationFunction<number>;
    overallRank?: ValidationFunction<string>;
    offenseRank?: ValidationFunction<string>;
    defenseRank?: ValidationFunction<string>;
    slottedRound?: ValidationFunction<number>;
    firstTimePlayer?: ValidationFunction<boolean>;
    clubPlayer?: ValidationFunction<boolean>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type PlayerEvaluationUpdateFormOverridesProps = {
    PlayerEvaluationUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    playerId?: PrimitiveOverrideProps<TextFieldProps>;
    schoolGrade?: PrimitiveOverrideProps<TextFieldProps>;
    overallRank?: PrimitiveOverrideProps<TextFieldProps>;
    offenseRank?: PrimitiveOverrideProps<TextFieldProps>;
    defenseRank?: PrimitiveOverrideProps<TextFieldProps>;
    slottedRound?: PrimitiveOverrideProps<TextFieldProps>;
    firstTimePlayer?: PrimitiveOverrideProps<SwitchFieldProps>;
    clubPlayer?: PrimitiveOverrideProps<SwitchFieldProps>;
} & EscapeHatchProps;
export declare type PlayerEvaluationUpdateFormProps = React.PropsWithChildren<{
    overrides?: PlayerEvaluationUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    playerEvaluation?: any;
    onSubmit?: (fields: PlayerEvaluationUpdateFormInputValues) => PlayerEvaluationUpdateFormInputValues;
    onSuccess?: (fields: PlayerEvaluationUpdateFormInputValues) => void;
    onError?: (fields: PlayerEvaluationUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: PlayerEvaluationUpdateFormInputValues) => PlayerEvaluationUpdateFormInputValues;
    onValidate?: PlayerEvaluationUpdateFormValidationValues;
} & React.CSSProperties>;
export default function PlayerEvaluationUpdateForm(props: PlayerEvaluationUpdateFormProps): React.ReactElement;
