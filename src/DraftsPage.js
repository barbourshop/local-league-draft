import React, { useState, useEffect } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listTeams, listCoaches, listPlayers, getDraft, draftPicksByDraftID, listPlayerEvaluations } from './graphql/queries';
import { createDraft, createDraftPick, updatePlayer } from './graphql/mutations';

const PHASES = {
  PRE: 'PRE',
  DURING: 'DURING',
  POST: 'POST',
};

function shuffle(array) {
  // Fisher-Yates shuffle
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function DraftsPage() {
  const [phase, setPhase] = useState(PHASES.PRE);
  const [draftId, setDraftId] = useState(null);
  const [draftName, setDraftName] = useState('');
  const [teams, setTeams] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [teamCoachAssignments, setTeamCoachAssignments] = useState({});
  const [draftOrder, setDraftOrder] = useState([]);
  const [preAssigned, setPreAssigned] = useState([]); // {playerID, teamID, slottedRound}
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [draft, setDraft] = useState(null);
  const [draftPicks, setDraftPicks] = useState([]);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [autoPicking, setAutoPicking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const client = generateClient();
      const teamsRes = await client.graphql({ query: listTeams });
      const coachesRes = await client.graphql({ query: listCoaches });
      const playersRes = await client.graphql({ query: listPlayers });
      const evalsRes = await client.graphql({ query: listPlayerEvaluations, variables: { limit: 1000 } });
      const players = playersRes.data.listPlayers.items;
      const evaluations = evalsRes.data.listPlayerEvaluations.items;
      // Join evaluation data to players (by player.id === evaluation.playerId)
      const enrichedPlayers = players.map(player => {
        const evaluation = evaluations.find(e => e.playerId === player.id) || {};
        return { ...player, ...evaluation };
      });
      setTeams(teamsRes.data.listTeams.items);
      setCoaches(coachesRes.data.listCoaches.items);
      setPlayers(enrichedPlayers);
    };
    fetchData();
  }, []);

  const handleTeamSelect = (teamId) => {
    setSelectedTeams((prev) =>
      prev.includes(teamId) ? prev.filter((id) => id !== teamId) : [...prev, teamId]
    );
  };

  const handleCoachAssign = (teamId, coachId) => {
    setTeamCoachAssignments((prev) => ({ ...prev, [teamId]: coachId }));
  };

  const handleRandomizeOrder = () => {
    setDraftOrder(shuffle(selectedTeams));
  };

  const handlePreAssign = (playerID, teamID, slottedRound) => {
    setPreAssigned((prev) => {
      // Remove if already exists for this player
      const filtered = prev.filter((p) => p.playerID !== playerID);
      // Save assignment if either teamID or slottedRound is set
      if (teamID || slottedRound) {
        return [
          ...filtered,
          {
            playerID,
            teamID: teamID || '',
            slottedRound: slottedRound ? Number(slottedRound) : ''
          }
        ];
      }
      return filtered;
    });
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setError(null);
    try {
      const client = generateClient();
      const input = {
        name: draftName || 'Draft',
        phase: 'PRE',
        draftOrder,
        preAssignedPlayers: preAssigned,
      };
      const res = await client.graphql({
        query: createDraft,
        variables: { input },
      });
      setDraftId(res.data.createDraft.id);
      setPhase(PHASES.DURING);
    } catch (err) {
      setError('Failed to save draft: ' + (err.errors?.[0]?.message || err.message));
    } finally {
      setSaving(false);
    }
  };

  // Fetch draft and picks when DURING phase starts
  useEffect(() => {
    if (phase === PHASES.DURING && draftId) {
      const fetchDraft = async () => {
        const client = generateClient();
        const res = await client.graphql({ query: getDraft, variables: { id: draftId } });
        setDraft(res.data.getDraft);
        // Fetch picks
        const picksRes = await client.graphql({ query: draftPicksByDraftID, variables: { draftID: draftId } });
        setDraftPicks(picksRes.data.draftPicksByDraftID.items);
      };
      fetchDraft();
    }
  }, [phase, draftId]);

  // Determine current team and round based on number of picks and draft order
  let currentTeamId = null;
  let currentTeam = null;
  let currentRound = 1;
  if (draft && draft.draftOrder && draft.draftOrder.length > 0 && availablePlayers.length > 0) {
    const pickNum = draftPicks.length;
    const totalTeams = draft.draftOrder.length;
    currentRound = Math.floor(pickNum / totalTeams) + 1;
    const pickInRound = pickNum % totalTeams;
    currentTeamId = draft.draftOrder[pickInRound];
    currentTeam = teams.find(t => t.id === currentTeamId);
  }

  // Update available players as picks are made
  useEffect(() => {
    if (phase === PHASES.DURING) {
      const pickedPlayerIds = draftPicks.map(p => p.playerID);
      let filteredPlayers = players.filter(p => !pickedPlayerIds.includes(p.id));
      // Exclude pre-assigned players except for the current team/round
      if (draft && draft.preAssignedPlayers && currentTeamId && currentRound) {
        filteredPlayers = filteredPlayers.filter(p => {
          const pre = draft.preAssignedPlayers.find(
            pa => pa.playerID === p.id
          );
          // If not pre-assigned, include
          if (!pre) return true;
          // If pre-assigned, only include if it's for this team/round
          return pre.teamID === currentTeamId && pre.slottedRound === currentRound;
        });
      }
      setAvailablePlayers(filteredPlayers);
    }
  }, [phase, draftPicks, players, draft, currentTeamId, currentRound]);

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

  // Helper to get pre-assigned player for a team and round
  function getPreAssignedPlayer(teamID, round) {
    if (!draft || !draft.preAssignedPlayers) return null;
    return draft.preAssignedPlayers.find(
      (p) => p.teamID === teamID && p.slottedRound === round
    );
  }

  // Effect: on draftPicks or DURING phase, check if next pick is a pre-assigned player and auto-pick if so
  useEffect(() => {
    if (phase !== PHASES.DURING || !draft || !draft.draftOrder || availablePlayers.length === 0) return;
    const pickNum = draftPicks.length;
    const totalTeams = draft.draftOrder.length;
    const round = Math.floor(pickNum / totalTeams) + 1;
    const pickInRound = pickNum % totalTeams;
    const teamID = draft.draftOrder[pickInRound];
    const pre = getPreAssignedPlayer(teamID, round);
    // Only auto-pick if not already picked and player is still available
    if (pre && availablePlayers.some(p => p.id === pre.playerID) && !draftPicks.some(p => p.playerID === pre.playerID) && !autoPicking) {
      setAutoPicking(true);
      // Auto-pick this player for this team/round
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
        // Refresh picks
        const picksRes = await client.graphql({ query: draftPicksByDraftID, variables: { draftID: draft.id } });
        setDraftPicks(picksRes.data.draftPicksByDraftID.items);
        setAutoPicking(false);
      };
      autoPick();
    }
  }, [phase, draft, draftPicks, availablePlayers, autoPicking]);

  // Add a select all/clear all handler
  const handleSelectAllTeams = () => {
    if (selectedTeams.length === teams.length) {
      setSelectedTeams([]);
    } else {
      setSelectedTeams(teams.map(t => t.id));
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Drafts</h1>
      {phase === PHASES.PRE && (
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left Column: Draft Name, Save, Select Teams */}
          <div style={{ flex: 1, minWidth: 220, maxWidth: 300, borderRight: '1px solid #eee', paddingRight: 16 }}>
            <h2>Draft Setup</h2>
            <div style={{ marginBottom: 24 }}>
              <label>
                Draft Name:
                <input
                  type="text"
                  value={draftName}
                  onChange={e => setDraftName(e.target.value)}
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>
            <div style={{ marginBottom: 24 }}>
              <button onClick={handleSaveDraft} disabled={saving || !draftOrder.length || !draftName} style={{ marginBottom: 16 }}>
                {saving ? 'Saving...' : 'Save Draft Setup'}
              </button>
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
            <div style={{ marginBottom: 24 }}>
              <h3>Select Teams</h3>
              <button onClick={handleSelectAllTeams} style={{ marginBottom: 8 }}>
                {selectedTeams.length === teams.length ? 'Clear All' : 'Select All'}
              </button>
              {teams.map((team) => (
                <div key={team.id}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedTeams.includes(team.id)}
                      onChange={() => handleTeamSelect(team.id)}
                    />
                    {team.name}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Column: Draft Order */}
          <div style={{ flex: 1, minWidth: 220, maxWidth: 300, borderRight: '1px solid #eee', padding: '0 16px' }}>
            <h2>Draft Order</h2>
            <div style={{ marginBottom: 24 }}>
              <button onClick={handleRandomizeOrder} disabled={selectedTeams.length < 2}>
                Randomize Order
              </button>
            </div>
            {draftOrder.length > 0 && (
              <ol>
                {draftOrder.map((teamId, idx) => {
                  const team = teams.find((t) => t.id === teamId);
                  return <li key={teamId}>{team ? team.name : teamId}</li>;
                })}
              </ol>
            )}
          </div>

          {/* Right Column: Pre-Assign Players to Teams */}
          <div style={{ flex: 2, minWidth: 320, paddingLeft: 16 }}>
            <h2>Pre-Assign Players to Teams</h2>
            <table>
              <thead>
                <tr>
                  <th>Player</th>
                  <th>Assign to Team</th>
                  <th>Slotted Round</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player.id}>
                    <td>{player.name}</td>
                    <td>
                      <select
                        value={
                          preAssigned.find((p) => p.playerID === player.id)?.teamID || ''
                        }
                        onChange={(e) => {
                          const slottedRound = preAssigned.find((p) => p.playerID === player.id)?.slottedRound || '';
                          handlePreAssign(player.id, e.target.value, slottedRound);
                        }}
                      >
                        <option value="">--</option>
                        {selectedTeams.map((teamId) => {
                          const team = teams.find((t) => t.id === teamId);
                          return (
                            <option key={teamId} value={teamId}>
                              {team ? team.name : teamId}
                            </option>
                          );
                        })}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        style={{ width: 60 }}
                        value={
                          preAssigned.find((p) => p.playerID === player.id)?.slottedRound || ''
                        }
                        onChange={(e) => {
                          const teamID = preAssigned.find((p) => p.playerID === player.id)?.teamID || '';
                          handlePreAssign(player.id, teamID, e.target.value);
                        }}
                        disabled={
                          !preAssigned.find((p) => p.playerID === player.id)?.teamID
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {phase === PHASES.DURING && draftId && draft && (
        <div style={{ display: 'flex', gap: 24 }}>
          {/* Left Column: Draft Order and Current Info */}
          <div style={{ flex: 1, minWidth: 220, maxWidth: 300, borderRight: '1px solid #eee', paddingRight: 16 }}>
            <div style={{ marginBottom: 16 }}>
              <strong>Shareable Live Draft Link: </strong>
              <a href={`/drafts/${draftId}`}>{window.location.origin + `/drafts/${draftId}`}</a>
            </div>
            <button onClick={() => setPhase(PHASES.POST)} style={{ marginBottom: 24 }}>
              Finish Draft
            </button>
            <h2>Draft Order</h2>
            <ol>
              {draft.draftOrder.map((teamId, idx) => {
                const team = teams.find((t) => t.id === teamId);
                return <li key={teamId}>{team ? team.name : teamId}</li>;
              })}
            </ol>
            <h3 style={{ marginTop: 24 }}>Current Round: {currentRound}</h3>
            <h3>Pick Number: {draftPicks.length + 1}</h3>
            <h3>Current Team: {currentTeam ? currentTeam.name : currentTeamId}</h3>
          </div>

          {/* Middle Column: Draft Results */}
          <div style={{ flex: 2, minWidth: 320, maxWidth: 500, padding: '0 16px', borderRight: '1px solid #eee' }}>
            <h2>Draft Results</h2>
            <ol style={{ listStyle: 'none', padding: 0 }}>
              {/* Group picks by round, order rounds descending, picks in round by draft order descending */}
              {(() => {
                if (!draftPicks.length) return null;
                const totalTeams = draft.draftOrder.length;
                // Group picks by round
                const picksByRound = {};
                draftPicks.forEach((pick) => {
                  const round = pick.round || 1;
                  if (!picksByRound[round]) picksByRound[round] = [];
                  picksByRound[round].push(pick);
                });
                // Get all rounds, sort descending (latest round first)
                const allRounds = Object.keys(picksByRound).map(Number).sort((a, b) => b - a);
                return allRounds.map(roundNum => {
                  // For this round, order picks by draft order index descending (Pick N to Pick 1)
                  const picks = picksByRound[roundNum].slice().sort((a, b) => {
                    const aIdx = draft.draftOrder.findIndex(id => id === a.teamID);
                    const bIdx = draft.draftOrder.findIndex(id => id === b.teamID);
                    return bIdx - aIdx;
                  });
                  return picks.map((pick) => {
                    const team = teams.find((t) => t.id === pick.teamID);
                    const player = players.find((p) => p.id === pick.playerID);
                    const pickInRound = draft.draftOrder.findIndex(id => id === pick.teamID) + 1;
                    const isAutoPick = !!pick.slottedRound;
                    return (
                      <li key={pick.id || `${roundNum}-${pick.teamID}`} style={{ marginBottom: 8 }}>
                        <strong>Round {roundNum}, Pick {pickInRound}:</strong> {team ? team.name : pick.teamID} selects {player ? player.name : pick.playerID}{isAutoPick ? ' [AUTOPICK]' : ''}
                      </li>
                    );
                  });
                }).flat();
              })()}
            </ol>
          </div>

          {/* Right Column: Available Players */}
          <div style={{ flex: 2, minWidth: 320, paddingLeft: 16 }}>
            <h2>Available Players</h2>
            {availablePlayers.length > 0 ? (() => {
              // Sort by overallRank ascending (lowest first)
              const sortedPlayers = [...availablePlayers].sort((a, b) => {
                const rankA = Number(a.overallRank || 9999);
                const rankB = Number(b.overallRank || 9999);
                return rankA - rankB;
              });
              const pickNum = draftPicks.length;
              const totalTeams = draft.draftOrder.length;
              const round = Math.floor(pickNum / totalTeams) + 1;
              const pickInRound = pickNum % totalTeams;
              const teamID = draft && draft.draftOrder ? draft.draftOrder[pickInRound] : null;
              const pre = getPreAssignedPlayer(teamID, round);
              if ((autoPicking || (pre && sortedPlayers.some(p => p.id === pre.playerID) && !draftPicks.some(p => p.playerID === pre.playerID)))) {
                const player = players.find(p => p.id === pre?.playerID);
                return (
                  <div style={{ color: 'orange', marginBottom: 12 }}>
                    Skipped: {currentTeam ? currentTeam.name : teamID} auto-picked pre-assigned player {player ? player.name : pre?.playerID} for round {pre?.slottedRound}
                  </div>
                );
              }
              return (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left' }}>Name</th>
                      <th style={{ textAlign: 'left' }}>Overall Rank</th>
                      <th style={{ textAlign: 'left' }}>Skill</th>
                      <th style={{ textAlign: 'left' }}>First Time?</th>
                      <th style={{ textAlign: 'left' }}>Club?</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedPlayers.map((player) => (
                      <tr key={player.id}>
                        <td>{player.name}</td>
                        <td>{player.overallRank ?? '-'}</td>
                        <td>{player.skillRating ?? '-'}</td>
                        <td>{player.firstTimePlayer ? 'Yes' : 'No'}</td>
                        <td>{player.clubPlayer ? 'Yes' : 'No'}</td>
                        <td>
                          <button onClick={() => handleMakePick(player.id)} style={{ marginLeft: 8 }}>
                            Pick
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              );
            })() : <div style={{ color: 'green', marginBottom: 12 }}>Draft complete! All players have been picked.</div>}
          </div>
        </div>
      )}
      {phase === PHASES.POST && draftId && (
        <div>
          <h2>Post-Draft Evaluation</h2>
          <div style={{ marginBottom: 16, maxWidth: 600 }}>
            <strong>Key:</strong>
            <ul style={{ fontSize: '0.98em', margin: '8px 0 16px 18px', padding: 0 }}>
              <li><span style={{ background: '#ffe0e0', padding: '0 4px' }}>Red background</span>: Roster size is above average</li>
              <li><span style={{ background: '#e0e0ff', padding: '0 4px' }}>Blue background</span>: Roster size is below average</li>
              <li><span style={{ background: '#e0ffe0', padding: '0 4px' }}>Green background</span>: Avg skill is below average</li>
              <li><span style={{ background: '#fff0e0', padding: '0 4px' }}>Orange background</span>: Avg skill is above average</li>
              <li><span style={{ color: 'red' }}>Red text</span>: First-time or club player count is above average</li>
            </ul>
          </div>
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
      )}
    </div>
  );
}

export { PostDraftEvaluation, WriteResultsAndExportButtons };

function PostDraftEvaluation({ teams, players, draftPicks }) {
  // Debug logs
  console.log({ players, draftPicks, teams });
  // Only include teams that participated in the draft (i.e., have picks)
  const teamIdsWithPicks = Array.from(new Set(draftPicks.map(p => p.teamID)));
  const draftedTeams = teams.filter(team => teamIdsWithPicks.includes(team.id));

  // Build team rosters
  const teamRosters = {};
  draftPicks.forEach(pick => {
    if (!teamRosters[pick.teamID]) teamRosters[pick.teamID] = [];
    teamRosters[pick.teamID].push(pick.playerID);
  });
  console.log('teamRosters', teamRosters);

  // Calculate stats for each team
  const teamStats = draftedTeams.map(team => {
    const roster = (teamRosters[team.id] || []).map(pid => players.find(p => p.id === pid)).filter(Boolean);
    console.log('roster for team', team.name, roster);
    const rosterSize = roster.length;
    const skillRatings = roster.map(p => Number(p.overallRank || p.skillRating || 0)).filter(val => !isNaN(val) && val > 0);
    const avgSkill = skillRatings.length ? (skillRatings.reduce((a, b) => a + b, 0) / skillRatings.length).toFixed(2) : 0;
    const minSkill = skillRatings.length ? Math.min(...skillRatings) : 0;
    const maxSkill = skillRatings.length ? Math.max(...skillRatings) : 0;
    const firstTimeCount = roster.filter(p => p.firstTimePlayer).length;
    const clubCount = roster.filter(p => p.clubPlayer).length;
    return {
      team,
      rosterSize,
      avgSkill,
      minSkill,
      maxSkill,
      firstTimeCount,
      clubCount,
      roster,
    };
  });

  // Calculate averages for highlighting
  const avgRosterSize = teamStats.length ? teamStats.reduce((a, t) => a + t.rosterSize, 0) / teamStats.length : 0;
  const avgFirstTime = teamStats.length ? teamStats.reduce((a, t) => a + t.firstTimeCount, 0) / teamStats.length : 0;
  const avgClub = teamStats.length ? teamStats.reduce((a, t) => a + t.clubCount, 0) / teamStats.length : 0;
  const avgSkillAvg = teamStats.length ? teamStats.reduce((a, t) => a + Number(t.avgSkill || 0), 0) / teamStats.length : 0;

  return (
    <table border="1" cellPadding={6} style={{ borderCollapse: 'collapse', marginTop: 16 }}>
      <thead>
        <tr>
          <th>Team</th>
          <th>Roster Size</th>
          <th>Avg Skill</th>
          <th>Min Skill</th>
          <th>Max Skill</th>
          <th>First-Time Players</th>
          <th>Club Players</th>
          <th>Roster</th>
        </tr>
      </thead>
      <tbody>
        {teamStats.map(stat => (
          <tr key={stat.team.id}
            style={{
              background:
                stat.rosterSize > avgRosterSize + 1 ? '#ffe0e0' :
                stat.rosterSize < avgRosterSize - 1 ? '#e0e0ff' :
                Number(stat.avgSkill) < avgSkillAvg - 0.5 ? '#e0ffe0' :
                Number(stat.avgSkill) > avgSkillAvg + 0.5 ? '#fff0e0' :
                undefined
            }}
          >
            <td>{stat.team.name}</td>
            <td>{stat.rosterSize}</td>
            <td>{stat.avgSkill}</td>
            <td>{stat.minSkill}</td>
            <td>{stat.maxSkill}</td>
            <td style={{ color: stat.firstTimeCount > avgFirstTime + 1 ? 'red' : undefined }}>{stat.firstTimeCount}</td>
            <td style={{ color: stat.clubCount > avgClub + 1 ? 'red' : undefined }}>{stat.clubCount}</td>
            <td>{stat.roster.map(p => p.name).join(', ')}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function WriteResultsAndExportButtons({ draftPicks, players, teams }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);
  const [progress, setProgress] = React.useState('');

  // Map playerID to teamID from draftPicks
  const playerToTeam = {};
  draftPicks.forEach(pick => {
    playerToTeam[pick.playerID] = pick.teamID;
  });

  // Write results to DB
  const handleWriteResults = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    setProgress('');
    const client = generateClient();
    try {
      // Refetch latest players to get correct _version
      const playersRes = await client.graphql({ query: require('./graphql/queries').listPlayers });
      const latestPlayers = playersRes.data.listPlayers.items;
      for (let i = 0; i < draftPicks.length; i++) {
        const pick = draftPicks[i];
        // Use the latest player data
        const player = latestPlayers.find(p => p.id === pick.playerID);
        if (!player) continue;
        setProgress(`Updating player ${player.name} (${i + 1} of ${draftPicks.length})...`);
        console.log(`Updating player ${player.name}`);
        // Build input with only allowed fields for UpdatePlayerInput, including _version if present
        const input = {
          id: player.id,
          name: player.name,
          teamID: pick.teamID,
        };
        if (player._version !== undefined) {
          input._version = player._version;
        }
        await client.graphql({
          query: updatePlayer,
          variables: { input },
        });
      }
      setSuccess('Draft results written to database!');
      setProgress('');
    } catch (err) {
      setError('Failed to write results: ' + (err.errors?.[0]?.message || err.message));
      setProgress('');
    } finally {
      setLoading(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    // Build array of {playerName, teamName, pickNumber, round}
    // draftPicks is in pick order
    const rows = draftPicks.map((pick, idx) => {
      const player = players.find(p => p.id === pick.playerID);
      const team = teams.find(t => t.id === pick.teamID);
      return {
        playerName: player ? player.name : pick.playerID,
        teamName: team ? team.name : pick.teamID,
        pickNumber: idx + 1,
        round: pick.round || null,
      };
    });
    // Sort: if round is present, by round then pickNumber; else by pickNumber
    rows.sort((a, b) => {
      if (a.round && b.round) {
        if (a.round !== b.round) return a.round - b.round;
        return a.pickNumber - b.pickNumber;
      }
      return a.pickNumber - b.pickNumber;
    });
    // CSV header
    let header, csvRows;
    if (rows.some(r => r.round)) {
      header = ['Player Name', 'Team Name', 'Round'];
      csvRows = rows.map(row =>
        [row.playerName, row.teamName, row.round]
          .map(val => '"' + String(val ?? '').replace(/"/g, '""') + '"')
          .join(',')
      );
    } else {
      header = ['Player Name', 'Team Name', 'Pick Number'];
      csvRows = rows.map(row =>
        [row.playerName, row.teamName, row.pickNumber]
          .map(val => '"' + String(val ?? '').replace(/"/g, '""') + '"')
          .join(',')
      );
    }
    const csv = [header.join(',')].concat(csvRows).join('\r\n');
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'draft-results.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ marginBottom: 16 }}>
      <button onClick={handleWriteResults} disabled={loading} style={{ marginRight: 12 }}>
        {loading ? 'Writing Results...' : 'Write Results to DB'}
      </button>
      <button onClick={handleExportCSV}>
        Export Results as CSV
      </button>
      {progress && <div style={{ color: '#555', marginTop: 8 }}>{progress}</div>}
      {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
    </div>
  );
} 