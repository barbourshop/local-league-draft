import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { generateClient } from 'aws-amplify/api';
import { listPlayers, listPlayerEvaluations, listTeams, listCoaches, getDraft, draftPicksByDraftID } from './graphql/queries';
import { updatePlayer, createDraftPick } from './graphql/mutations';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';
import PlayerForm from './PlayerForm';
import TeamsPage from './TeamsPage';
import AssignPlayersPage from './AssignPlayersPage';
import CoachesPage from './CoachesPage';
import TeamDetailsPage from './TeamDetailsPage';
import DraftsPage, { PostDraftEvaluation, WriteResultsAndExportButtons } from './DraftsPage';

Amplify.configure(awsExports);

const client = generateClient();

const columns = [
  { key: 'name', label: 'Player' },
  { key: 'schoolGrade', label: 'School Grade' },
  { key: 'overallRank', label: 'Overall Rank' },
  { key: 'offenseRank', label: 'Offense Rank' },
  { key: 'defenseRank', label: 'Defense Rank' },
  { key: 'firstTimePlayer', label: 'First Time Player' },
  { key: 'clubPlayer', label: 'Club Player' },
  { key: 'teamName', label: 'Team' },
];

function PlayerTable({ players, loading, error, filters, setFilters, notFilters, setNotFilters, sortConfig, setSortConfig, onUpdate }) {
  const [refresh, setRefresh] = useState(0);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleNotChange = (key, checked) => {
    setNotFilters((prev) => ({ ...prev, [key]: checked }));
  };

  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        // Toggle direction
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  const filteredPlayers = players.filter(p =>
    columns.every(col => {
      const filterValue = filters[col.key];
      const not = notFilters[col.key];
      if (!filterValue) return true;
      let cellValue = p[col.key];
      if (typeof cellValue === 'boolean') {
        cellValue = cellValue ? 'Yes' : 'No';
      }
      const match = String(cellValue || '').toLowerCase().includes(filterValue.toLowerCase());
      return not ? !match : match;
    })
  );

  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return filteredPlayers;
    const sorted = [...filteredPlayers];
    sorted.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];
      // For booleans, sort Yes > No
      if (typeof aValue === 'boolean' || typeof bValue === 'boolean') {
        aValue = aValue ? 1 : 0;
        bValue = bValue ? 1 : 0;
      }
      // For numbers, sort numerically
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else {
        // Otherwise, sort as strings
        aValue = String(aValue || '').toLowerCase();
        bValue = String(bValue || '').toLowerCase();
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [filteredPlayers, sortConfig]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Player Evaluation Results</h1>
      <table>
        <thead>
          <tr className="filter-row">
            {columns.map(col => (
              <th key={col.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <input
                    type="text"
                    placeholder={`Filter ${col.label}`}
                    value={filters[col.key] || ''}
                    onChange={e => handleFilterChange(col.key, e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <label title="NOT" style={{ display: 'flex', alignItems: 'center', fontSize: '0.9em', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={!!notFilters[col.key]}
                      onChange={e => handleNotChange(col.key, e.target.checked)}
                      style={{ marginLeft: 2, marginRight: 2 }}
                    />
                    ≠
                  </label>
                </div>
              </th>
            ))}
          </tr>
          <tr>
            {columns.map(col => (
              <th
                key={col.key}
                style={{ cursor: 'pointer', userSelect: 'none' }}
                onClick={() => handleSort(col.key)}
              >
                {col.label}
                {sortConfig.key === col.key && (
                  <span style={{ marginLeft: 4 }}>
                    {sortConfig.direction === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedPlayers.map(p => (
            <tr key={p.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.key === 'name' ? (
                    <Link to={`/edit/${p.id}`}>{p.name || p.id}</Link>
                  ) : col.key === 'teamName' ? (
                    p.teamName
                  ) : (
                    typeof p[col.key] === 'boolean' ? (p[col.key] ? 'Yes' : 'No') : p[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, textAlign: 'right' }}>
        <Link to="/new" style={{ fontWeight: 600, fontSize: '1.1em', textDecoration: 'underline' }}>
          + Create New Player Evaluation
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({});
  const [notFilters, setNotFilters] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [playerRes, evalRes, teamRes, coachRes] = await Promise.all([
          client.graphql({ query: listPlayers }),
          client.graphql({ query: listPlayerEvaluations }),
          client.graphql({ query: listTeams }),
          client.graphql({ query: listCoaches }),
        ]);
        const players = playerRes.data.listPlayers.items;
        const evaluations = evalRes.data.listPlayerEvaluations.items;
        const teams = teamRes.data.listTeams.items;
        const coaches = coachRes.data.listCoaches.items;
        // Join data
        const joined = players.map(player => {
          const evaluation = evaluations.find(e => e.playerId === player.id) || {};
          const team = teams.find(t => t.id === player.teamID);
          // Find coach by player.coachId, or by teamID
          let coach = null;
          if (player.coachId) {
            coach = coaches.find(c => c.id === player.coachId);
          } else if (player.teamID) {
            coach = coaches.find(c => c.teamID === player.teamID);
          }
          return {
            ...player,
            ...evaluation,
            teamName: team ? team.name : '',
            coachName: coach ? coach.name : '',
          };
        });
        setPlayers(joined);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const handleRefresh = () => setRefresh(r => r + 1);

  return (
    <Router>
      <div style={{ padding: 16, borderBottom: '1px solid #eee', marginBottom: 24 }}>
        <Link to="/" style={{ marginRight: 16 }}>Players</Link>
        <Link to="/teams" style={{ marginRight: 16 }}>Teams</Link>
        <Link to="/coaches" style={{ marginRight: 16 }}>Coaches</Link>
        <Link to="/assign-players" style={{ marginRight: 16 }}>Assign Players</Link>
        <Link to="/drafts">Drafts</Link>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <PlayerTable
              players={players}
              loading={loading}
              error={error}
              filters={filters}
              setFilters={setFilters}
              notFilters={notFilters}
              setNotFilters={setNotFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
              onUpdate={handleRefresh}
            />
          }
        />
        <Route path="/teams" element={<TeamsPage />} />
        <Route path="/coaches" element={<CoachesPage />} />
        <Route path="/assign-players" element={<AssignPlayersPage />} />
        <Route path="/drafts" element={<DraftsPage />} />
        <Route path="/drafts/:id" element={<DraftPage />} />
        <Route path="/new" element={<PlayerForm mode="new" onSave={handleRefresh} />} />
        <Route path="/edit/:id" element={<PlayerForm mode="edit" onSave={handleRefresh} />} />
        <Route path="/teams/:id" element={<TeamDetailsPage />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Placeholder for the unique draft page
function DraftPage() {
  const { id } = useParams();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [draft, setDraft] = React.useState(null);
  const [teams, setTeams] = React.useState([]);
  const [players, setPlayers] = React.useState([]);
  const [draftPicks, setDraftPicks] = React.useState([]);
  const [availablePlayers, setAvailablePlayers] = React.useState([]);
  const [autoPicking, setAutoPicking] = React.useState(false);
  const [showPost, setShowPost] = React.useState(false);

  // Load draft, teams, players, and picks
  React.useEffect(() => {
    async function fetchAll() {
      setLoading(true);
      setError(null);
      try {
        const client = generateClient();
        const [draftRes, teamsRes, playersRes, evalsRes, picksRes] = await Promise.all([
          client.graphql({ query: getDraft, variables: { id } }),
          client.graphql({ query: listTeams }),
          client.graphql({ query: listPlayers }),
          client.graphql({ query: listPlayerEvaluations, variables: { limit: 1000 } }),
          client.graphql({ query: draftPicksByDraftID, variables: { draftID: id } }),
        ]);
        const players = playersRes.data.listPlayers.items;
        const evaluations = evalsRes.data.listPlayerEvaluations.items;
        // Join evaluation data to players (by player.id === evaluation.playerId)
        const enrichedPlayers = players.map(player => {
          const evaluation = evaluations.find(e => e.playerId === player.id) || {};
          return { ...player, ...evaluation };
        });
        setDraft(draftRes.data.getDraft);
        setTeams(teamsRes.data.listTeams.items);
        setPlayers(enrichedPlayers);
        setDraftPicks(picksRes.data.draftPicksByDraftID.items);
      } catch (err) {
        setError('Failed to load draft: ' + (err.errors?.[0]?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, [id]);

  // Determine current team and round
  let currentTeamId = null;
  let currentTeam = null;
  let currentRound = 1;
  if (draft && draft.draftOrder && draft.draftOrder.length > 0 && players.length > 0) {
    const pickNum = draftPicks.length;
    const totalTeams = draft.draftOrder.length;
    currentRound = Math.floor(pickNum / totalTeams) + 1;
    const pickInRound = pickNum % totalTeams;
    currentTeamId = draft.draftOrder[pickInRound];
    currentTeam = teams.find(t => t.id === currentTeamId);
  }

  // Update available players as picks are made
  React.useEffect(() => {
    if (!draft) return;
    const pickedPlayerIds = draftPicks.map(p => p.playerID);
    let filteredPlayers = players.filter(p => !pickedPlayerIds.includes(p.id));
    // Exclude pre-assigned players except for the current team/round
    if (draft.preAssignedPlayers && currentTeamId && currentRound) {
      filteredPlayers = filteredPlayers.filter(p => {
        const pre = draft.preAssignedPlayers.find(pa => pa.playerID === p.id);
        if (!pre) return true;
        return pre.teamID === currentTeamId && pre.slottedRound === currentRound;
      });
    }
    setAvailablePlayers(filteredPlayers);
  }, [draft, draftPicks, players, currentTeamId, currentRound]);

  // Helper to get pre-assigned player for a team and round
  function getPreAssignedPlayer(teamID, round) {
    if (!draft || !draft.preAssignedPlayers) return null;
    return draft.preAssignedPlayers.find(
      (p) => p.teamID === teamID && p.slottedRound === round
    );
  }

  // Handle making a pick
  const handleMakePick = async (playerId) => {
    if (!draft || !currentTeamId) return;
    const client = generateClient();
    await client.graphql({
      query: createDraftPick,
      variables: {
        input: {
          draftID: draft.id,
          round: Math.floor(draftPicks.length / draft.draftOrder.length) + 1,
          teamID: currentTeamId,
          playerID: playerId,
        },
      },
    });
    // Refresh picks
    const picksRes = await client.graphql({ query: draftPicksByDraftID, variables: { draftID: draft.id } });
    setDraftPicks(picksRes.data.draftPicksByDraftID.items);
  };

  // Auto-pick pre-assigned player if needed
  React.useEffect(() => {
    if (!draft || !draft.draftOrder || availablePlayers.length === 0) return;
    const pickNum = draftPicks.length;
    const totalTeams = draft.draftOrder.length;
    const round = Math.floor(pickNum / totalTeams) + 1;
    const pickInRound = pickNum % totalTeams;
    const teamID = draft.draftOrder[pickInRound];
    const pre = getPreAssignedPlayer(teamID, round);
    if (pre && availablePlayers.some(p => p.id === pre.playerID) && !draftPicks.some(p => p.playerID === pre.playerID) && !autoPicking) {
      setAutoPicking(true);
      const autoPick = async () => {
        const client = generateClient();
        await client.graphql({
          query: createDraftPick,
          variables: {
            input: {
              draftID: draft.id,
              round,
              teamID,
              playerID: pre.playerID,
              slottedRound: pre.slottedRound,
            },
          },
        });
        const picksRes = await client.graphql({ query: draftPicksByDraftID, variables: { draftID: draft.id } });
        setDraftPicks(picksRes.data.draftPicksByDraftID.items);
        setAutoPicking(false);
      };
      autoPick();
    }
  }, [draft, draftPicks, availablePlayers, autoPicking]);

  if (loading) return <div>Loading draft...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!draft) return <div>Draft not found.</div>;

  return (
    <div style={{ padding: 24 }}>
      <h1>Live Draft: {draft.name}</h1>
      <button onClick={() => setShowPost(p => !p)} style={{ marginBottom: 16 }}>
        {showPost ? 'Back to Live Draft' : 'Show Post-Draft Evaluation'}
      </button>
      {showPost ? (
        <div>
          <h2>Post-Draft Evaluation</h2>
          <div style={{ marginBottom: 24 }}>
            <WriteResultsAndExportButtons
              draftPicks={draftPicks}
              players={players}
              teams={teams}
            />
          </div>
          <PostDraftEvaluation
            teams={teams}
            players={players}
            draftPicks={draftPicks}
          />
        </div>
      ) : (
        <>
          <h3>Draft Order</h3>
          <ol>
            {draft.draftOrder.map((teamId) => {
              const team = teams.find((t) => t.id === teamId);
              return <li key={teamId}>{team ? team.name : teamId}</li>;
            })}
          </ol>
          <h3>Current Round: {currentRound}</h3>
          <h3>Current Team: {currentTeam ? currentTeam.name : currentTeamId}</h3>
          {availablePlayers.length > 0 ? (() => {
            const pickNum = draftPicks.length;
            const totalTeams = draft.draftOrder.length;
            const round = Math.floor(pickNum / totalTeams) + 1;
            const pickInRound = pickNum % totalTeams;
            const teamID = draft && draft.draftOrder ? draft.draftOrder[pickInRound] : null;
            const pre = getPreAssignedPlayer(teamID, round);
            if ((autoPicking || (pre && availablePlayers.some(p => p.id === pre.playerID) && !draftPicks.some(p => p.playerID === pre.playerID)))) {
              const player = players.find(p => p.id === pre?.playerID);
              return (
                <div style={{ color: 'orange', marginBottom: 12 }}>
                  Skipped: {currentTeam ? currentTeam.name : teamID} auto-picked pre-assigned player {player ? player.name : pre?.playerID} for round {pre?.slottedRound}
                </div>
              );
            }
            return (
              <>
                <h4>Available Players</h4>
                <ul>
                  {availablePlayers.map((player) => (
                    <li key={player.id}>
                      {player.name}
                      <button onClick={() => handleMakePick(player.id)} style={{ marginLeft: 8 }}>
                        Pick
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            );
          })() : <div style={{ color: 'green', marginBottom: 12 }}>Draft complete! All players have been picked.</div>}
          <h4>Picks So Far</h4>
          <ol>
            {draftPicks.map((pick, idx) => {
              const team = teams.find((t) => t.id === pick.teamID);
              const player = players.find((p) => p.id === pick.playerID);
              return (
                <li key={pick.id || idx}>
                  {team ? team.name : pick.teamID} picked {player ? player.name : pick.playerID}
                </li>
              );
            })}
          </ol>
        </>
      )}
    </div>
  );
} 