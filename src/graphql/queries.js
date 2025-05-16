/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getPlayer = /* GraphQL */ `
  query GetPlayer($id: ID!) {
    getPlayer(id: $id) {
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
export const listPlayers = /* GraphQL */ `
  query ListPlayers(
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPlayerCoachAssignment = /* GraphQL */ `
  query GetPlayerCoachAssignment($id: ID!) {
    getPlayerCoachAssignment(id: $id) {
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
export const listPlayerCoachAssignments = /* GraphQL */ `
  query ListPlayerCoachAssignments(
    $filter: ModelPlayerCoachAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPlayerCoachAssignments(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        playerId
        coachId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getCoach = /* GraphQL */ `
  query GetCoach($id: ID!) {
    getCoach(id: $id) {
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
export const listCoaches = /* GraphQL */ `
  query ListCoaches(
    $filter: ModelCoachFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCoaches(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const playersByTeamID = /* GraphQL */ `
  query PlayersByTeamID(
    $teamID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playersByTeamID(
      teamID: $teamID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const playerCoachAssignmentsByPlayerId = /* GraphQL */ `
  query PlayerCoachAssignmentsByPlayerId(
    $playerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerCoachAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerCoachAssignmentsByPlayerId(
      playerId: $playerId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        playerId
        coachId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const playerCoachAssignmentsByCoachId = /* GraphQL */ `
  query PlayerCoachAssignmentsByCoachId(
    $coachId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerCoachAssignmentFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerCoachAssignmentsByCoachId(
      coachId: $coachId
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        playerId
        coachId
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const coachesByTeamID = /* GraphQL */ `
  query CoachesByTeamID(
    $teamID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelCoachFilterInput
    $limit: Int
    $nextToken: String
  ) {
    coachesByTeamID(
      teamID: $teamID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        name
        teamID
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getPlayerEvaluation = /* GraphQL */ `
  query GetPlayerEvaluation($id: ID!) {
    getPlayerEvaluation(id: $id) {
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
export const playerEvaluationsByPlayerId = /* GraphQL */ `
  query PlayerEvaluationsByPlayerId(
    $playerId: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelPlayerEvaluationFilterInput
    $limit: Int
    $nextToken: String
  ) {
    playerEvaluationsByPlayerId(
      playerId: $playerId
      sortDirection: $sortDirection
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
export const getTeam = /* GraphQL */ `
  query GetTeam($id: ID!) {
    getTeam(id: $id) {
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
export const listTeams = /* GraphQL */ `
  query ListTeams(
    $filter: ModelTeamFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTeams(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        createdAt
        updatedAt
        draftTeamsId
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDraft = /* GraphQL */ `
  query GetDraft($id: ID!) {
    getDraft(id: $id) {
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
export const listDrafts = /* GraphQL */ `
  query ListDrafts(
    $filter: ModelDraftFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDrafts(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        phase
        draftOrder
        createdAt
        updatedAt
        __typename
      }
      nextToken
      __typename
    }
  }
`;
export const getDraftPick = /* GraphQL */ `
  query GetDraftPick($id: ID!) {
    getDraftPick(id: $id) {
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
export const listDraftPicks = /* GraphQL */ `
  query ListDraftPicks(
    $filter: ModelDraftPickFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listDraftPicks(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      __typename
    }
  }
`;
export const draftPicksByDraftID = /* GraphQL */ `
  query DraftPicksByDraftID(
    $draftID: ID!
    $sortDirection: ModelSortDirection
    $filter: ModelDraftPickFilterInput
    $limit: Int
    $nextToken: String
  ) {
    draftPicksByDraftID(
      draftID: $draftID
      sortDirection: $sortDirection
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
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
      nextToken
      __typename
    }
  }
`;
