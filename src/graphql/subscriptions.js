/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePlayer = /* GraphQL */ `
  subscription OnCreatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onCreatePlayer(filter: $filter) {
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
export const onUpdatePlayer = /* GraphQL */ `
  subscription OnUpdatePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onUpdatePlayer(filter: $filter) {
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
export const onDeletePlayer = /* GraphQL */ `
  subscription OnDeletePlayer($filter: ModelSubscriptionPlayerFilterInput) {
    onDeletePlayer(filter: $filter) {
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
export const onCreatePlayerCoachAssignment = /* GraphQL */ `
  subscription OnCreatePlayerCoachAssignment(
    $filter: ModelSubscriptionPlayerCoachAssignmentFilterInput
  ) {
    onCreatePlayerCoachAssignment(filter: $filter) {
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
export const onUpdatePlayerCoachAssignment = /* GraphQL */ `
  subscription OnUpdatePlayerCoachAssignment(
    $filter: ModelSubscriptionPlayerCoachAssignmentFilterInput
  ) {
    onUpdatePlayerCoachAssignment(filter: $filter) {
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
export const onDeletePlayerCoachAssignment = /* GraphQL */ `
  subscription OnDeletePlayerCoachAssignment(
    $filter: ModelSubscriptionPlayerCoachAssignmentFilterInput
  ) {
    onDeletePlayerCoachAssignment(filter: $filter) {
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
export const onCreateCoach = /* GraphQL */ `
  subscription OnCreateCoach($filter: ModelSubscriptionCoachFilterInput) {
    onCreateCoach(filter: $filter) {
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
export const onUpdateCoach = /* GraphQL */ `
  subscription OnUpdateCoach($filter: ModelSubscriptionCoachFilterInput) {
    onUpdateCoach(filter: $filter) {
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
export const onDeleteCoach = /* GraphQL */ `
  subscription OnDeleteCoach($filter: ModelSubscriptionCoachFilterInput) {
    onDeleteCoach(filter: $filter) {
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
export const onCreatePlayerEvaluation = /* GraphQL */ `
  subscription OnCreatePlayerEvaluation(
    $filter: ModelSubscriptionPlayerEvaluationFilterInput
  ) {
    onCreatePlayerEvaluation(filter: $filter) {
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
export const onUpdatePlayerEvaluation = /* GraphQL */ `
  subscription OnUpdatePlayerEvaluation(
    $filter: ModelSubscriptionPlayerEvaluationFilterInput
  ) {
    onUpdatePlayerEvaluation(filter: $filter) {
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
export const onDeletePlayerEvaluation = /* GraphQL */ `
  subscription OnDeletePlayerEvaluation(
    $filter: ModelSubscriptionPlayerEvaluationFilterInput
  ) {
    onDeletePlayerEvaluation(filter: $filter) {
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
export const onCreateTeam = /* GraphQL */ `
  subscription OnCreateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onCreateTeam(filter: $filter) {
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
export const onUpdateTeam = /* GraphQL */ `
  subscription OnUpdateTeam($filter: ModelSubscriptionTeamFilterInput) {
    onUpdateTeam(filter: $filter) {
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
export const onDeleteTeam = /* GraphQL */ `
  subscription OnDeleteTeam($filter: ModelSubscriptionTeamFilterInput) {
    onDeleteTeam(filter: $filter) {
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
export const onCreateDraft = /* GraphQL */ `
  subscription OnCreateDraft($filter: ModelSubscriptionDraftFilterInput) {
    onCreateDraft(filter: $filter) {
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
export const onUpdateDraft = /* GraphQL */ `
  subscription OnUpdateDraft($filter: ModelSubscriptionDraftFilterInput) {
    onUpdateDraft(filter: $filter) {
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
export const onDeleteDraft = /* GraphQL */ `
  subscription OnDeleteDraft($filter: ModelSubscriptionDraftFilterInput) {
    onDeleteDraft(filter: $filter) {
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
export const onCreateDraftPick = /* GraphQL */ `
  subscription OnCreateDraftPick(
    $filter: ModelSubscriptionDraftPickFilterInput
  ) {
    onCreateDraftPick(filter: $filter) {
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
export const onUpdateDraftPick = /* GraphQL */ `
  subscription OnUpdateDraftPick(
    $filter: ModelSubscriptionDraftPickFilterInput
  ) {
    onUpdateDraftPick(filter: $filter) {
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
export const onDeleteDraftPick = /* GraphQL */ `
  subscription OnDeleteDraftPick(
    $filter: ModelSubscriptionDraftPickFilterInput
  ) {
    onDeleteDraftPick(filter: $filter) {
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
