/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayerEvaluation = /* GraphQL */ `
  mutation CreatePlayerEvaluation(
    $input: CreatePlayerEvaluationInput!
    $condition: ModelPlayerEvaluationConditionInput
  ) {
    createPlayerEvaluation(input: $input, condition: $condition) {
      id
      playerId
      schoolGrade
      overallRank
      offenseRank
      defenseRank
      slottedRound
      firstTimePlayer
      clubPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePlayerEvaluation = /* GraphQL */ `
  mutation UpdatePlayerEvaluation(
    $input: UpdatePlayerEvaluationInput!
    $condition: ModelPlayerEvaluationConditionInput
  ) {
    updatePlayerEvaluation(input: $input, condition: $condition) {
      id
      playerId
      schoolGrade
      overallRank
      offenseRank
      defenseRank
      slottedRound
      firstTimePlayer
      clubPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePlayerEvaluation = /* GraphQL */ `
  mutation DeletePlayerEvaluation(
    $input: DeletePlayerEvaluationInput!
    $condition: ModelPlayerEvaluationConditionInput
  ) {
    deletePlayerEvaluation(input: $input, condition: $condition) {
      id
      playerId
      schoolGrade
      overallRank
      offenseRank
      defenseRank
      slottedRound
      firstTimePlayer
      clubPlayer
      createdAt
      updatedAt
      __typename
    }
  }
`;
