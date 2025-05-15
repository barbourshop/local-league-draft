/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

/* eslint-disable */
import * as React from "react";
import {
  Button,
  Flex,
  Grid,
  SwitchField,
  TextField,
} from "@aws-amplify/ui-react";
import { fetchByPath, getOverrideProps, validateField } from "./utils";
import { generateClient } from "aws-amplify/api";
import { createPlayerEvaluation } from "../graphql/mutations";
const client = generateClient();
export default function PlayerEvaluationCreateForm(props) {
  const {
    clearOnSuccess = true,
    onSuccess,
    onError,
    onSubmit,
    onValidate,
    onChange,
    overrides,
    ...rest
  } = props;
  const initialValues = {
    playerId: "",
    schoolGrade: "",
    overallRank: "",
    offenseRank: "",
    defenseRank: "",
    slottedRound: "",
    firstTimePlayer: false,
    clubPlayer: false,
  };
  const [playerId, setPlayerId] = React.useState(initialValues.playerId);
  const [schoolGrade, setSchoolGrade] = React.useState(
    initialValues.schoolGrade
  );
  const [overallRank, setOverallRank] = React.useState(
    initialValues.overallRank
  );
  const [offenseRank, setOffenseRank] = React.useState(
    initialValues.offenseRank
  );
  const [defenseRank, setDefenseRank] = React.useState(
    initialValues.defenseRank
  );
  const [slottedRound, setSlottedRound] = React.useState(
    initialValues.slottedRound
  );
  const [firstTimePlayer, setFirstTimePlayer] = React.useState(
    initialValues.firstTimePlayer
  );
  const [clubPlayer, setClubPlayer] = React.useState(initialValues.clubPlayer);
  const [errors, setErrors] = React.useState({});
  const resetStateValues = () => {
    setPlayerId(initialValues.playerId);
    setSchoolGrade(initialValues.schoolGrade);
    setOverallRank(initialValues.overallRank);
    setOffenseRank(initialValues.offenseRank);
    setDefenseRank(initialValues.defenseRank);
    setSlottedRound(initialValues.slottedRound);
    setFirstTimePlayer(initialValues.firstTimePlayer);
    setClubPlayer(initialValues.clubPlayer);
    setErrors({});
  };
  const validations = {
    playerId: [{ type: "Required" }],
    schoolGrade: [{ type: "Required" }],
    overallRank: [],
    offenseRank: [],
    defenseRank: [],
    slottedRound: [],
    firstTimePlayer: [],
    clubPlayer: [],
  };
  const runValidationTasks = async (
    fieldName,
    currentValue,
    getDisplayValue
  ) => {
    const value =
      currentValue && getDisplayValue
        ? getDisplayValue(currentValue)
        : currentValue;
    let validationResponse = validateField(value, validations[fieldName]);
    const customValidator = fetchByPath(onValidate, fieldName);
    if (customValidator) {
      validationResponse = await customValidator(value, validationResponse);
    }
    setErrors((errors) => ({ ...errors, [fieldName]: validationResponse }));
    return validationResponse;
  };
  return (
    <Grid
      as="form"
      rowGap="15px"
      columnGap="15px"
      padding="20px"
      onSubmit={async (event) => {
        event.preventDefault();
        let modelFields = {
          playerId,
          schoolGrade,
          overallRank,
          offenseRank,
          defenseRank,
          slottedRound,
          firstTimePlayer,
          clubPlayer,
        };
        const validationResponses = await Promise.all(
          Object.keys(validations).reduce((promises, fieldName) => {
            if (Array.isArray(modelFields[fieldName])) {
              promises.push(
                ...modelFields[fieldName].map((item) =>
                  runValidationTasks(fieldName, item)
                )
              );
              return promises;
            }
            promises.push(
              runValidationTasks(fieldName, modelFields[fieldName])
            );
            return promises;
          }, [])
        );
        if (validationResponses.some((r) => r.hasError)) {
          return;
        }
        if (onSubmit) {
          modelFields = onSubmit(modelFields);
        }
        try {
          Object.entries(modelFields).forEach(([key, value]) => {
            if (typeof value === "string" && value === "") {
              modelFields[key] = null;
            }
          });
          await client.graphql({
            query: createPlayerEvaluation.replaceAll("__typename", ""),
            variables: {
              input: {
                ...modelFields,
              },
            },
          });
          if (onSuccess) {
            onSuccess(modelFields);
          }
          if (clearOnSuccess) {
            resetStateValues();
          }
        } catch (err) {
          if (onError) {
            const messages = err.errors.map((e) => e.message).join("\n");
            onError(modelFields, messages);
          }
        }
      }}
      {...getOverrideProps(overrides, "PlayerEvaluationCreateForm")}
      {...rest}
    >
      <TextField
        label="Player id"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={playerId}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              playerId: value,
              schoolGrade,
              overallRank,
              offenseRank,
              defenseRank,
              slottedRound,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.playerId ?? value;
          }
          if (errors.playerId?.hasError) {
            runValidationTasks("playerId", value);
          }
          setPlayerId(value);
        }}
        onBlur={() => runValidationTasks("playerId", playerId)}
        errorMessage={errors.playerId?.errorMessage}
        hasError={errors.playerId?.hasError}
        {...getOverrideProps(overrides, "playerId")}
      ></TextField>
      <TextField
        label="School grade"
        isRequired={true}
        isReadOnly={false}
        type="number"
        step="any"
        value={schoolGrade}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade: value,
              overallRank,
              offenseRank,
              defenseRank,
              slottedRound,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.schoolGrade ?? value;
          }
          if (errors.schoolGrade?.hasError) {
            runValidationTasks("schoolGrade", value);
          }
          setSchoolGrade(value);
        }}
        onBlur={() => runValidationTasks("schoolGrade", schoolGrade)}
        errorMessage={errors.schoolGrade?.errorMessage}
        hasError={errors.schoolGrade?.hasError}
        {...getOverrideProps(overrides, "schoolGrade")}
      ></TextField>
      <TextField
        label="Overall rank"
        isRequired={false}
        isReadOnly={false}
        value={overallRank}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank: value,
              offenseRank,
              defenseRank,
              slottedRound,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.overallRank ?? value;
          }
          if (errors.overallRank?.hasError) {
            runValidationTasks("overallRank", value);
          }
          setOverallRank(value);
        }}
        onBlur={() => runValidationTasks("overallRank", overallRank)}
        errorMessage={errors.overallRank?.errorMessage}
        hasError={errors.overallRank?.hasError}
        {...getOverrideProps(overrides, "overallRank")}
      ></TextField>
      <TextField
        label="Offense rank"
        isRequired={false}
        isReadOnly={false}
        value={offenseRank}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank,
              offenseRank: value,
              defenseRank,
              slottedRound,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.offenseRank ?? value;
          }
          if (errors.offenseRank?.hasError) {
            runValidationTasks("offenseRank", value);
          }
          setOffenseRank(value);
        }}
        onBlur={() => runValidationTasks("offenseRank", offenseRank)}
        errorMessage={errors.offenseRank?.errorMessage}
        hasError={errors.offenseRank?.hasError}
        {...getOverrideProps(overrides, "offenseRank")}
      ></TextField>
      <TextField
        label="Defense rank"
        isRequired={false}
        isReadOnly={false}
        value={defenseRank}
        onChange={(e) => {
          let { value } = e.target;
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank,
              offenseRank,
              defenseRank: value,
              slottedRound,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.defenseRank ?? value;
          }
          if (errors.defenseRank?.hasError) {
            runValidationTasks("defenseRank", value);
          }
          setDefenseRank(value);
        }}
        onBlur={() => runValidationTasks("defenseRank", defenseRank)}
        errorMessage={errors.defenseRank?.errorMessage}
        hasError={errors.defenseRank?.hasError}
        {...getOverrideProps(overrides, "defenseRank")}
      ></TextField>
      <TextField
        label="Slotted round"
        isRequired={false}
        isReadOnly={false}
        type="number"
        step="any"
        value={slottedRound}
        onChange={(e) => {
          let value = isNaN(parseInt(e.target.value))
            ? e.target.value
            : parseInt(e.target.value);
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank,
              offenseRank,
              defenseRank,
              slottedRound: value,
              firstTimePlayer,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.slottedRound ?? value;
          }
          if (errors.slottedRound?.hasError) {
            runValidationTasks("slottedRound", value);
          }
          setSlottedRound(value);
        }}
        onBlur={() => runValidationTasks("slottedRound", slottedRound)}
        errorMessage={errors.slottedRound?.errorMessage}
        hasError={errors.slottedRound?.hasError}
        {...getOverrideProps(overrides, "slottedRound")}
      ></TextField>
      <SwitchField
        label="First time player"
        defaultChecked={false}
        isDisabled={false}
        isChecked={firstTimePlayer}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank,
              offenseRank,
              defenseRank,
              slottedRound,
              firstTimePlayer: value,
              clubPlayer,
            };
            const result = onChange(modelFields);
            value = result?.firstTimePlayer ?? value;
          }
          if (errors.firstTimePlayer?.hasError) {
            runValidationTasks("firstTimePlayer", value);
          }
          setFirstTimePlayer(value);
        }}
        onBlur={() => runValidationTasks("firstTimePlayer", firstTimePlayer)}
        errorMessage={errors.firstTimePlayer?.errorMessage}
        hasError={errors.firstTimePlayer?.hasError}
        {...getOverrideProps(overrides, "firstTimePlayer")}
      ></SwitchField>
      <SwitchField
        label="Club player"
        defaultChecked={false}
        isDisabled={false}
        isChecked={clubPlayer}
        onChange={(e) => {
          let value = e.target.checked;
          if (onChange) {
            const modelFields = {
              playerId,
              schoolGrade,
              overallRank,
              offenseRank,
              defenseRank,
              slottedRound,
              firstTimePlayer,
              clubPlayer: value,
            };
            const result = onChange(modelFields);
            value = result?.clubPlayer ?? value;
          }
          if (errors.clubPlayer?.hasError) {
            runValidationTasks("clubPlayer", value);
          }
          setClubPlayer(value);
        }}
        onBlur={() => runValidationTasks("clubPlayer", clubPlayer)}
        errorMessage={errors.clubPlayer?.errorMessage}
        hasError={errors.clubPlayer?.hasError}
        {...getOverrideProps(overrides, "clubPlayer")}
      ></SwitchField>
      <Flex
        justifyContent="space-between"
        {...getOverrideProps(overrides, "CTAFlex")}
      >
        <Button
          children="Clear"
          type="reset"
          onClick={(event) => {
            event.preventDefault();
            resetStateValues();
          }}
          {...getOverrideProps(overrides, "ClearButton")}
        ></Button>
        <Flex
          gap="15px"
          {...getOverrideProps(overrides, "RightAlignCTASubFlex")}
        >
          <Button
            children="Submit"
            type="submit"
            variation="primary"
            isDisabled={Object.values(errors).some((e) => e?.hasError)}
            {...getOverrideProps(overrides, "SubmitButton")}
          ></Button>
        </Flex>
      </Flex>
    </Grid>
  );
}
