import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getTeam, playersByTeamID, coachesByTeamID, listPlayerEvaluations, playerEvaluationsByPlayerId, listPlayers } from './graphql/queries';
import { updateTeam, deleteTeam, updateCoach, deleteCoach, updatePlayer, deletePlayer } from './graphql/mutations';
import TeamUpdateForm from './ui-components/TeamUpdateForm';
import CoachUpdateForm from './ui-components/CoachUpdateForm';
import PlayerUpdateForm from './ui-components/PlayerUpdateForm';

export default function TeamDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [playerEvaluations, setPlayerEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editTeam, setEditTeam] = useState(false);
  const [editCoachId, setEditCoachId] = useState(null);
  const [editPlayerId, setEditPlayerId] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const client = generateClient();
        // Fetch all players and evaluations, then filter by teamID
        const [teamRes, allPlayersRes, allEvalsRes, coachesRes] = await Promise.all([
          client.graphql({ query: getTeam, variables: { id } }),
          client.graphql({ query: listPlayers, variables: { limit: 1000 } }),
          client.graphql({ query: listPlayerEvaluations, variables: { limit: 1000 } }),
          client.graphql({ query: coachesByTeamID, variables: { teamID: id } })
        ]);
        const allPlayers = allPlayersRes.data.listPlayers.items;
        const allEvals = allEvalsRes.data.listPlayerEvaluations.items;
        // Filter players by teamID
        const teamPlayers = allPlayers.filter(p => p.teamID === id);
        setTeam(teamRes.data.getTeam);
        setPlayers(teamPlayers);
        setCoaches(coachesRes.data.coachesByTeamID.items);
        // Build a map for fast lookup
        const evalMap = {};
        allEvals.forEach(e => { if (e && e.playerId) evalMap[e.playerId] = e; });
        setPlayerEvaluations(evalMap);
      } catch (err) {
        setError(err.message || 'Error fetching team details');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, refresh]);

  const handleDeleteTeam = async () => {
    if (!window.confirm('Delete this team?')) return;
    const client = generateClient();
    await client.graphql({ query: deleteTeam, variables: { input: { id } } });
    navigate('/teams');
  };

  const handleDeleteCoach = async (coachId) => {
    if (!window.confirm('Delete this coach?')) return;
    const client = generateClient();
    await client.graphql({ query: deleteCoach, variables: { input: { id: coachId } } });
    setRefresh(r => r + 1);
  };

  const handleDeletePlayer = async (playerId) => {
    if (!window.confirm('Delete this player?')) return;
    const client = generateClient();
    await client.graphql({ query: deletePlayer, variables: { input: { id: playerId } } });
    setRefresh(r => r + 1);
  };

  // Sorting logic for players
  const sortedPlayers = React.useMemo(() => {
    if (!sortConfig.key) return players;
    const sorted = [...players];
    sorted.sort((a, b) => {
      let aValue, bValue;
      if (sortConfig.key === 'name') {
        aValue = a.name || '';
        bValue = b.name || '';
      } else {
        const evalA = playerEvaluations[a.id] || {};
        const evalB = playerEvaluations[b.id] || {};
        aValue = evalA[sortConfig.key];
        bValue = evalB[sortConfig.key];
        // For booleans, sort Yes > No
        if (typeof aValue === 'boolean' || typeof bValue === 'boolean') {
          aValue = aValue ? 1 : 0;
          bValue = bValue ? 1 : 0;
        }
        // For numbers, sort numerically
        if (!isNaN(Number(aValue)) && !isNaN(Number(bValue)) && aValue !== undefined && bValue !== undefined) {
          aValue = Number(aValue);
          bValue = Number(bValue);
        } else {
          aValue = String(aValue ?? '').toLowerCase();
          bValue = String(bValue ?? '').toLowerCase();
        }
      }
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [players, playerEvaluations, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => {
      if (prev.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      } else {
        return { key, direction: 'asc' };
      }
    });
  };

  if (loading) return <div>Loading team details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!team) return <div>Team not found</div>;

  return (
    <div className="container">
      <h1>Team: {team.name}</h1>
      <button onClick={() => setEditTeam(true)} style={{ marginRight: 8 }}>Edit Team</button>
      <button onClick={handleDeleteTeam} style={{ color: 'red' }}>Delete Team</button>
      <Link to="/teams" style={{ marginLeft: 16 }}>Back to Teams</Link>
      {editTeam && (
        <div className="modal">
          <h2>Edit Team</h2>
          <TeamUpdateForm idProp={team.id} onSuccess={() => { setEditTeam(false); setRefresh(r => r + 1); }} onCancel={() => setEditTeam(false)} />
        </div>
      )}
      <h2 style={{ marginTop: 32 }}>Coach</h2>
      {coaches.length === 0 ? (
        <div>No coach assigned.</div>
      ) : (
        coaches.map(coach => (
          <div key={coach.id} style={{ marginBottom: 16 }}>
            <span>{coach.name}</span>
          </div>
        ))
      )}
      <h2 style={{ marginTop: 32 }}>Players</h2>
      {players.length === 0 ? (
        <div>No players assigned.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                Name{sortConfig.key === 'name' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('schoolGrade')}>
                School Grade{sortConfig.key === 'schoolGrade' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('overallRank')}>
                Overall Rank{sortConfig.key === 'overallRank' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('offenseRank')}>
                Offense Rank{sortConfig.key === 'offenseRank' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('defenseRank')}>
                Defense Rank{sortConfig.key === 'defenseRank' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('slottedRound')}>
                Slotted Round{sortConfig.key === 'slottedRound' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('firstTimePlayer')}>
                First Time Player{sortConfig.key === 'firstTimePlayer' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('clubPlayer')}>
                Club Player{sortConfig.key === 'clubPlayer' && (sortConfig.direction === 'asc' ? ' ▲' : ' ▼')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedPlayers.map(player => {
              const evalData = playerEvaluations[player.id] || {};
              return (
                <tr key={player.id}>
                  <td>{player.name}</td>
                  <td>{evalData.schoolGrade ?? ''}</td>
                  <td>{evalData.overallRank ?? ''}</td>
                  <td>{evalData.offenseRank ?? ''}</td>
                  <td>{evalData.defenseRank ?? ''}</td>
                  <td>{evalData.slottedRound ?? ''}</td>
                  <td>{evalData.firstTimePlayer ? 'Yes' : evalData.firstTimePlayer === false ? 'No' : ''}</td>
                  <td>{evalData.clubPlayer ? 'Yes' : evalData.clubPlayer === false ? 'No' : ''}</td>
                  <td>
                    <button onClick={() => setEditPlayerId(player.id)} style={{ marginRight: 8 }}>Edit</button>
                    <button onClick={() => handleDeletePlayer(player.id)} style={{ color: 'red' }}>Delete</button>
                    {editPlayerId === player.id && (
                      <div className="modal">
                        <h3>Edit Player</h3>
                        <PlayerUpdateForm idProp={player.id} onSuccess={() => { setEditPlayerId(null); setRefresh(r => r + 1); }} onCancel={() => setEditPlayerId(null)} />
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
} 