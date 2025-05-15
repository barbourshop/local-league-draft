import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listTeams, listCoaches } from './graphql/queries';
import { createTeam, updateTeam, deleteTeam, updateCoach } from './graphql/mutations';
import CoachUpdateForm from './ui-components/CoachUpdateForm';
import { Link } from 'react-router-dom';

export default function TeamsPage() {
  const [teams, setTeams] = useState([]);
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editTeam, setEditTeam] = useState(null);
  const [editCoach, setEditCoach] = useState(null);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const client = generateClient();
        const [teamResult, coachResult] = await Promise.all([
          client.graphql({ query: listTeams }),
          client.graphql({ query: listCoaches })
        ]);
        setTeams(teamResult.data.listTeams.items);
        setCoaches(coachResult.data.listCoaches.items);
      } catch (err) {
        setError(err.message || 'Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [refresh]);

  const handleCreate = async (fields) => {
    const client = generateClient();
    await client.graphql({
      query: createTeam,
      variables: { input: { name: fields.name } }
    });
    setShowCreate(false);
    setRefresh(r => r + 1);
  };

  const handleEdit = async (fields) => {
    const client = generateClient();
    await client.graphql({
      query: updateTeam,
      variables: { input: { id: editTeam.id, name: fields.name } }
    });
    setEditTeam(null);
    setRefresh(r => r + 1);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this team?')) return;
    const client = generateClient();
    await client.graphql({
      query: deleteTeam,
      variables: { input: { id } }
    });
    setRefresh(r => r + 1);
  };

  const handleAssignCoach = async (team, coachId) => {
    const client = generateClient();
    // Unassign any coach currently assigned to this team
    const currentCoach = coaches.find(c => c.teamID === team.id);
    if (currentCoach && currentCoach.id !== coachId) {
      await client.graphql({
        query: updateCoach,
        variables: { input: { id: currentCoach.id, teamID: null } }
      });
    }
    // Assign selected coach
    if (coachId) {
      await client.graphql({
        query: updateCoach,
        variables: { input: { id: coachId, teamID: team.id } }
      });
    }
    setRefresh(r => r + 1);
  };

  if (loading) return <div>Loading teams and coaches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Teams</h1>
      <button onClick={() => setShowCreate(true)} style={{ marginBottom: 16 }}>+ Add Team</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Team Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Coach</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {teams.map(team => {
            const coach = coaches.find(c => c.teamID === team.id);
            return (
              <tr key={team.id}>
                <td><Link to={`/teams/${team.id}`}>{team.name}</Link></td>
                <td>
                  <select
                    value={coach ? coach.id : ''}
                    onChange={e => handleAssignCoach(team, e.target.value)}
                  >
                    <option value=''>-- Unassigned --</option>
                    {coaches.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button onClick={() => setEditTeam(team)} style={{ marginRight: 8 }}>Edit</button>
                  <button onClick={() => handleDelete(team.id)} style={{ color: 'red' }}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Create Modal */}
      {showCreate && (
        <div className="modal">
          <h2>Add Team</h2>
          <form onSubmit={e => { e.preventDefault(); handleCreate({ name: e.target.name.value }); }}>
            <input name="name" placeholder="Team Name" required />
            <button type="submit">Create</button>
            <button type="button" onClick={() => setShowCreate(false)}>Cancel</button>
          </form>
        </div>
      )}
      {/* Edit Modal */}
      {editTeam && (
        <div className="modal">
          <h2>Edit Team</h2>
          <form onSubmit={e => { e.preventDefault(); handleEdit({ name: e.target.name.value }); }}>
            <input name="name" defaultValue={editTeam.name} required />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditTeam(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
} 