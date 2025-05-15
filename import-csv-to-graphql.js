// Load environment variables from .env file
require('dotenv').config();
const fs = require('fs');
const { parse } = require('csv-parse');

const API_URL = process.env.API_URL;
const API_KEY = process.env.API_KEY;

const mutation = `
mutation CreatePlayerEvaluation($input: CreatePlayerEvaluationInput!) {
  createPlayerEvaluation(input: $input) {
    id
  }
}
`;

function parseIntOrNull(value) {
  const n = parseInt(value, 10);
  return isNaN(n) ? null : n;
}

function parseBool(value) {
  return value && value.trim().toUpperCase() === 'Y';
}

function mapCsvRowToInput(row) {
  return {
    playerId: parseIntOrNull(row['Player ID']),
    schoolGrade: parseIntOrNull(row['School Grade']),
    overallRank: row['Overall Rank'] && row['Overall Rank'] !== 'NA' ? row['Overall Rank'] : null,
    offenseRank: row['Offense Rank'] && row['Offense Rank'] !== 'NA' ? row['Offense Rank'] : null,
    defenseRank: row['Defense Rank'] && row['Defense Rank'] !== 'NA' ? row['Defense Rank'] : null,
    slottedRound: parseIntOrNull(row['Slotted Round']),
    firstTimePlayer: row['First Time Player?'] ? parseBool(row['First Time Player?']) : null,
    clubPlayer: row['Club Player?'] ? parseBool(row['Club Player?']) : null,
  };
}

function csvToJson(filePath) {
  return new Promise((resolve, reject) => {
    const records = [];
    fs.createReadStream(filePath)
      .pipe(parse({ columns: true, trim: true }))
      .on('data', (row) => records.push(row))
      .on('end', () => resolve(records))
      .on('error', reject);
  });
}

async function importPlayerEvaluations() {
  const players = await csvToJson('sample-evaluation-results.csv');
  for (const player of players) {
    const input = mapCsvRowToInput(player);
    // Remove null fields
    Object.keys(input).forEach(key => input[key] === null && delete input[key]);
    const body = JSON.stringify({
      query: mutation,
      variables: { input },
    });

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': API_KEY,
        },
        body,
      });
      const json = await res.json();
      if (json.errors) {
        console.error('GraphQL error:', json.errors, 'Input:', input);
      } else {
        console.log('Imported:', input.playerId);
      }
    } catch (err) {
      console.error('Fetch error:', err, 'Input:', input);
    }
  }
}

importPlayerEvaluations(); 