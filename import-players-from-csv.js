// Use global fetch (Node 18+) or fallback to node-fetch
let fetchFunc = global.fetch;
if (!fetchFunc) {
  fetchFunc = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}
const awsmobile = require('./src/aws-exports').default;

const APPSYNC_URL = awsmobile.aws_appsync_graphqlEndpoint;
const API_KEY = awsmobile.aws_appsync_apiKey;

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

const csvPath = path.join(__dirname, 'sample-evaluation-results.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
});

function parseBool(val) {
  if (!val) return false;
  return val.trim().toUpperCase() === 'Y';
}

const createPlayer = `
  mutation CreatePlayer($input: CreatePlayerInput!) {
    createPlayer(input: $input) { id }
  }
`;

const updatePlayer = `
  mutation UpdatePlayer($input: UpdatePlayerInput!) {
    updatePlayer(input: $input) { id }
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

async function run() {
  for (const rec of records) {
    // Only send fields that exist on the Player model
    const input = {
      id: rec['Player ID'],
      name: `Player ${rec['Player ID']}`,
      // Optionally: add more fields if your schema allows
    };

    try {
      const result = await appsyncRequest(createPlayer, { input });
      console.log('Created:', input.name, result.createPlayer.id);
    } catch (err) {
      // If error is due to existing ID, try update
      if (
        (err.message && err.message.includes('already exists')) ||
        (err.message && err.message.includes('ConditionalCheckFailedException'))
      ) {
        try {
          const updateResult = await appsyncRequest(updatePlayer, { input });
          console.log('Updated:', input.name, updateResult.updatePlayer.id);
        } catch (updateErr) {
          console.error('Error updating player', input.name, updateErr.message || updateErr);
        }
      } else {
        console.error('Error creating player', input.name, err.message || err);
      }
    }
  }
}

run(); 