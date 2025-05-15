import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listPlayers, listTeams } from './graphql/queries';
import { updatePlayer } from './graphql/mutations';

export default function AssignPlayersPage() {
  const [players, setPlayers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [updating, setUpdating] = useState({});
  const [refresh, setRefresh] = useState(0);
  const [showUnassignedOnly, setShowUnassignedOnly] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const client = generateClient();
        const [playersRes, teamsRes] = await Promise.all([
          client.graphql({ query: listPlayers }),
          client.graphql({ query: listTeams })
        ]);
        setPlayers(playersRes.data.listPlayers.items);
        setTeams(teamsRes.data.listTeams.items);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const handleAssign = async (player, teamID) => {
    setUpdating(prev => ({ ...prev, [player.id]: true }));
    setError(null);
    setSuccess(null);
    try {
      const client = generateClient();
      await client.graphql({
        query: updatePlayer,
        variables: {
          input: {
            id: player.id,
            teamID: teamID || null,
          }
        }
      });
      setSuccess(`Assigned ${player.name} to team successfully.`);
      setRefresh(r => r + 1);
    } catch (err) {
      setError(err.message || 'Error assigning player');
    } finally {
      setUpdating(prev => ({ ...prev, [player.id]: false }));
    }
  };

  const handleAutoAssign = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      // Count current players per team
      const teamCounts = {};
      teams.forEach(team => { teamCounts[team.id] = 0; });
      players.forEach(player => {
        if (player.teamID && teamCounts[player.teamID] !== undefined) {
          teamCounts[player.teamID]++;
        }
      });
      // Get unassigned players
      const unassigned = players.filter(p => !p.teamID);
      // Sort teams by current count (ascending)
      const sortedTeams = [...teams].sort((a, b) => teamCounts[a.id] - teamCounts[b.id]);
      let teamIndex = 0;
      const client = generateClient();
      // Assign each unassigned player to the next team with the least players
      for (const player of unassigned) {
        // Find the team with the least players
        sortedTeams.sort((a, b) => teamCounts[a.id] - teamCounts[b.id]);
        const team = sortedTeams[0];
        await client.graphql({
          query: updatePlayer,
          variables: {
            input: {
              id: player.id,
              teamID: team.id,
            }
          }
        });
        teamCounts[team.id]++;
      }
      setSuccess('Players auto-assigned to teams!');
      setRefresh(r => r + 1);
    } catch (err) {
      setError(err.message || 'Error auto-assigning players');
    } finally {
      setLoading(false);
    }
  };

  const handleUnassignAll = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const client = generateClient();
      for (const player of players) {
        if (player.teamID) {
          await client.graphql({
            query: updatePlayer,
            variables: {
              input: {
                id: player.id,
                teamID: null,
              }
            }
          });
        }
      }
      setSuccess('All players have been unassigned from teams!');
      setRefresh(r => r + 1);
    } catch (err) {
      setError(err.message || 'Error unassigning players');
    } finally {
      setLoading(false);
    }
  };

  // Calculate player counts per team and unassigned
  const teamPlayerCounts = teams.map(team => ({
    id: team.id,
    name: team.name,
    count: players.filter(p => p.teamID === team.id).length
  }));
  const unassignedCount = players.filter(p => !p.teamID).length;

  if (loading) return <div>Loading players and teams...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Assign Players to Teams</h1>
      <div style={{ marginBottom: 16 }}>
        <label>
          <input
            type="checkbox"
            checked={showUnassignedOnly}
            onChange={e => setShowUnassignedOnly(e.target.checked)}
            style={{ marginRight: 8 }}
          />
          Show only unassigned players
        </label>
      </div>
      <div style={{ marginBottom: 16 }}>
        <strong>Player Counts:</strong>
        <ul style={{ margin: '8px 0 0 0', padding: 0, listStyle: 'none' }}>
          {teamPlayerCounts.map(team => (
            <li key={team.id}>{team.name}: {team.count}</li>
          ))}
          <li><em>Unassigned</em>: {unassignedCount}</li>
        </ul>
      </div>
      <button onClick={handleAutoAssign} disabled={loading} style={{ marginBottom: 16, marginRight: 8 }}>
        {loading ? 'Auto-Assigning...' : 'Auto-Assign Players'}
      </button>
      <button onClick={handleUnassignAll} disabled={loading} style={{ marginBottom: 16 }}>
        {loading ? 'Unassigning...' : 'Unassign All Players'}
      </button>
      {success && <div style={{ color: 'green', marginBottom: 12 }}>{success}</div>}
      {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
      <table>
        <thead>
          <tr>
            <th>Player</th>
            <th>Current Team</th>
            <th>Assign to Team</th>
          </tr>
        </thead>
        <tbody>
          {(showUnassignedOnly ? players.filter(player => !player.teamID) : players).map(player => {
            const currentTeam = teams.find(t => t.id === player.teamID);
            return (
              <tr key={player.id}>
                <td>{player.name}</td>
                <td>{currentTeam ? currentTeam.name : <em>None</em>}</td>
                <td>
                  <select
                    value={player.teamID || ''}
                    onChange={e => handleAssign(player, e.target.value)}
                    disabled={updating[player.id]}
                  >
                    <option value=''>-- Unassigned --</option>
                    {teams.map(team => (
                      <option key={team.id} value={team.id}>{team.name}</option>
                    ))}
                  </select>
                  {updating[player.id] && <span style={{ marginLeft: 8 }}>Saving...</span>}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
} 