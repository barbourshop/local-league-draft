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
        draftTeamsId
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      coachAssignments {
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
        draftTeamsId
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      coachAssignments {
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
        draftTeamsId
        __typename
      }
      evaluations {
        nextToken
        __typename
      }
      coachAssignments {
        nextToken
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createPlayerCoachAssignment = /* GraphQL */ `
  mutation CreatePlayerCoachAssignment(
    $input: CreatePlayerCoachAssignmentInput!
    $condition: ModelPlayerCoachAssignmentConditionInput
  ) {
    createPlayerCoachAssignment(input: $input, condition: $condition) {
      id
      playerId
      coachId
      player {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updatePlayerCoachAssignment = /* GraphQL */ `
  mutation UpdatePlayerCoachAssignment(
    $input: UpdatePlayerCoachAssignmentInput!
    $condition: ModelPlayerCoachAssignmentConditionInput
  ) {
    updatePlayerCoachAssignment(input: $input, condition: $condition) {
      id
      playerId
      coachId
      player {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deletePlayerCoachAssignment = /* GraphQL */ `
  mutation DeletePlayerCoachAssignment(
    $input: DeletePlayerCoachAssignmentInput!
    $condition: ModelPlayerCoachAssignmentConditionInput
  ) {
    deletePlayerCoachAssignment(input: $input, condition: $condition) {
      id
      playerId
      coachId
      player {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      coach {
        id
        name
        teamID
        createdAt
        updatedAt
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
        draftTeamsId
        __typename
      }
      playerAssignments {
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
        draftTeamsId
        __typename
      }
      playerAssignments {
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
        draftTeamsId
        __typename
      }
      playerAssignments {
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
      draftTeamsId
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
      draftTeamsId
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
      draftTeamsId
      __typename
    }
  }
`;
export const createDraft = /* GraphQL */ `
  mutation CreateDraft(
    $input: CreateDraftInput!
    $condition: ModelDraftConditionInput
  ) {
    createDraft(input: $input, condition: $condition) {
      id
      name
      phase
      teams {
        nextToken
        __typename
      }
      draftOrder
      picks {
        nextToken
        __typename
      }
      preAssignedPlayers {
        playerID
        teamID
        slottedRound
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDraft = /* GraphQL */ `
  mutation UpdateDraft(
    $input: UpdateDraftInput!
    $condition: ModelDraftConditionInput
  ) {
    updateDraft(input: $input, condition: $condition) {
      id
      name
      phase
      teams {
        nextToken
        __typename
      }
      draftOrder
      picks {
        nextToken
        __typename
      }
      preAssignedPlayers {
        playerID
        teamID
        slottedRound
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDraft = /* GraphQL */ `
  mutation DeleteDraft(
    $input: DeleteDraftInput!
    $condition: ModelDraftConditionInput
  ) {
    deleteDraft(input: $input, condition: $condition) {
      id
      name
      phase
      teams {
        nextToken
        __typename
      }
      draftOrder
      picks {
        nextToken
        __typename
      }
      preAssignedPlayers {
        playerID
        teamID
        slottedRound
        __typename
      }
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const createDraftPick = /* GraphQL */ `
  mutation CreateDraftPick(
    $input: CreateDraftPickInput!
    $condition: ModelDraftPickConditionInput
  ) {
    createDraftPick(input: $input, condition: $condition) {
      id
      draftID
      round
      teamID
      playerID
      slottedRound
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const updateDraftPick = /* GraphQL */ `
  mutation UpdateDraftPick(
    $input: UpdateDraftPickInput!
    $condition: ModelDraftPickConditionInput
  ) {
    updateDraftPick(input: $input, condition: $condition) {
      id
      draftID
      round
      teamID
      playerID
      slottedRound
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const deleteDraftPick = /* GraphQL */ `
  mutation DeleteDraftPick(
    $input: DeleteDraftPickInput!
    $condition: ModelDraftPickConditionInput
  ) {
    deleteDraftPick(input: $input, condition: $condition) {
      id
      draftID
      round
      teamID
      playerID
      slottedRound
      createdAt
      updatedAt
      __typename
    }
  }
`;
