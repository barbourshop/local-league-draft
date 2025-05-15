/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createPlayer = /* GraphQL */ `
  mutation CreatePlayer(
    $input: CreatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    createPlayer(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      coachId
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePlayer = /* GraphQL */ `
  mutation UpdatePlayer(
    $input: UpdatePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    updatePlayer(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      coachId
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePlayer = /* GraphQL */ `
  mutation DeletePlayer(
    $input: DeletePlayerInput!
    $condition: ModelPlayerConditionInput
  ) {
    deletePlayer(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      coachId
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createCoach = /* GraphQL */ `
  mutation CreateCoach(
    $input: CreateCoachInput!
    $condition: ModelCoachConditionInput
  ) {
    createCoach(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      players {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateCoach = /* GraphQL */ `
  mutation UpdateCoach(
    $input: UpdateCoachInput!
    $condition: ModelCoachConditionInput
  ) {
    updateCoach(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      players {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteCoach = /* GraphQL */ `
  mutation DeleteCoach(
    $input: DeleteCoachInput!
    $condition: ModelCoachConditionInput
  ) {
    deleteCoach(input: $input, condition: $condition) {
      id
      name
      teamID
      team {
        id
        name
        createdAt
        updatedAt
        __typename
      }
      players {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPlayerEvaluation = /* GraphQL */ `
  mutation CreatePlayerEvaluation(
    $input: CreatePlayerEvaluationInput!
    $condition: ModelPlayerEvaluationConditionInput
  ) {
    createPlayerEvaluation(input: $input, condition: $condition) {
      id
      playerId
      player {
        id
        name
        teamID
        coachId
        createdAt
        updatedAt
        __typename
      }
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
      player {
        id
        name
        teamID
        coachId
        createdAt
        updatedAt
        __typename
      }
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
      player {
        id
        name
        teamID
        coachId
        createdAt
        updatedAt
        __typename
      }
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
export const createTeam = /* GraphQL */ `
  mutation CreateTeam(
    $input: CreateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    createTeam(input: $input, condition: $condition) {
      id
      name
      players {
        nextToken
        __typename
      }
      coaches {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateTeam = /* GraphQL */ `
  mutation UpdateTeam(
    $input: UpdateTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    updateTeam(input: $input, condition: $condition) {
      id
      name
      players {
        nextToken
        __typename
      }
      coaches {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteTeam = /* GraphQL */ `
  mutation DeleteTeam(
    $input: DeleteTeamInput!
    $condition: ModelTeamConditionInput
  ) {
    deleteTeam(input: $input, condition: $condition) {
      id
      name
      players {
        nextToken
        __typename
      }
      coaches {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
