/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlayerEvaluation = /* GraphQL */ `
  query GetPlayerEvaluation($id: ID!) {
    getPlayerEvaluation(id: $id) {
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
export const listPlayerEvaluations = /* GraphQL */ `
  query ListPlayerEvaluations(
    $filter: ModelPlayerEvaluationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayerEvaluations(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
