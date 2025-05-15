// Use global fetch (Node 18+) or fallback to node-fetch
let fetchFunc = global.fetch;
if (!fetchFunc) {
  fetchFunc = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const awsmobile = require('./src/aws-exports').default;

const APPSYNC_URL = awsmobile.aws_appsync_graphqlEndpoint;
const API_KEY = awsmobile.aws_appsync_apiKey;

const PLACEHOLDER_TEAM_ID = 'UNASSIGNED_TEAM_ID';
const PLACEHOLDER_COACH_ID = 'UNASSIGNED_COACH_ID';

const listPlayerEvaluations = `
  query ListPlayerEvaluations($nextToken: String) {
    listPlayerEvaluations(limit: 1000, nextToken: $nextToken) {
      items {
        playerId
      }
      nextToken
    }
  }
`;

const listPlayers = `
  query ListPlayers($nextToken: String) {
    listPlayers(limit: 1000, nextToken: $nextToken) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const listTeams = `
  query ListTeams($nextToken: String) {
    listTeams(limit: 1000, nextToken: $nextToken) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const listCoaches = `
  query ListCoaches($nextToken: String) {
    listCoaches(limit: 1000, nextToken: $nextToken) {
      items {
        id
        name
      }
      nextToken
    }
  }
`;

const createTeam = `
  mutation CreateTeam($input: CreateTeamInput!) {
    createTeam(input: $input) { id name }
  }
`;

const createCoach = `
  mutation CreateCoach($input: CreateCoachInput!) {
    createCoach(input: $input) { id name }
  }
`;

const createPlayer = `
  mutation CreatePlayer($input: CreatePlayerInput!) {
    createPlayer(input: $input) { id name }
  }
`;

async function appsyncRequest(query, variables = {}) {
  const res = await fetchFunc(APPSYNC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

async function fetchAll(query) {
  let items = [];
  let nextToken = null;
  do {
    const data = await appsyncRequest(query, { nextToken });
    const key = Object.keys(data)[0];
    items = items.concat(data[key].items);
    nextToken = data[key].nextToken;
  } while (nextToken);
  return items;
}

async function ensurePlaceholderTeam() {
  const teams = await fetchAll(listTeams);
  let team = teams.find(t => t.id === PLACEHOLDER_TEAM_ID);
  if (!team) {
    const input = { id: PLACEHOLDER_TEAM_ID, name: 'Unassigned Team' };
    const result = await appsyncRequest(createTeam, { input });
    team = result.createTeam;
    console.log('Created placeholder Team:', team);
  }
  return team.id;
}

async function ensurePlaceholderCoach() {
  const coaches = await fetchAll(listCoaches);
  let coach = coaches.find(c => c.id === PLACEHOLDER_COACH_ID);
  if (!coach) {
    const input = { id: PLACEHOLDER_COACH_ID, name: 'Unassigned Coach' };
    const result = await appsyncRequest(createCoach, { input });
    coach = result.createCoach;
    console.log('Created placeholder Coach:', coach);
  }
  return coach.id;
}

async function run() {
  // Ensure placeholder Team and Coach exist
  const teamID = await ensurePlaceholderTeam();
  const coachId = await ensurePlaceholderCoach();

  // Fetch all PlayerEvaluations
  const evaluations = await fetchAll(listPlayerEvaluations);
  // Fetch all Players
  const players = await fetchAll(listPlayers);
  const existingPlayerIds = new Set(players.map(p => p.id));

  // Group evaluations by playerId
  const evalsByPlayerId = {};
  for (const ev of evaluations) {
    if (!evalsByPlayerId[ev.playerId]) evalsByPlayerId[ev.playerId] = ev;
  }

  let createdCount = 0;
  for (const playerId of Object.keys(evalsByPlayerId)) {
    if (existingPlayerIds.has(playerId)) {
      console.log(`Player already exists for playerId ${playerId}`);
      continue;
    }
    const input = {
      id: playerId,
      name: `Player ${playerId}`,
      teamID,
      coachId
    };
    try {
      const result = await appsyncRequest(createPlayer, { input });
      console.log('Created Player:', result.createPlayer);
      createdCount++;
    } catch (err) {
      console.error('Error creating player for playerId', playerId, err.message || err);
    }
  }
  console.log(`Done. Created ${createdCount} new Players.`);
}

run(); 