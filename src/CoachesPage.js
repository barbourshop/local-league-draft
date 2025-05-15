import React, { useEffect, useState } from 'react';
import { generateClient } from 'aws-amplify/api';
import { listCoaches, listTeams } from './graphql/queries';
import { deleteCoach, updateCoach } from './graphql/mutations';
import { CoachCreateForm, CoachUpdateForm } from './ui-components';

function SimpleModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.3)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
      onClick={onClose}
    >
      <div style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 400, maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default function CoachesPage() {
  const [coaches, setCoaches] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [editCoach, setEditCoach] = useState(null);
  const [refresh, setRefresh] = useState(0);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    async function fetchCoaches() {
      setLoading(true);
      try {
        const client = generateClient();
        const [coachRes, teamRes] = await Promise.all([
          client.graphql({ query: listCoaches }),
          client.graphql({ query: listTeams })
        ]);
        setCoaches(coachRes.data.listCoaches.items);
        setTeams(teamRes.data.listTeams.items);
      } catch (err) {
        setError(err.message || 'Error fetching coaches');
      } finally {
        setLoading(false);
      }
    }
    fetchCoaches();
  }, [refresh]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this coach?')) return;
    setDeletingId(id);
    try {
      const client = generateClient();
      await client.graphql({
        query: deleteCoach,
        variables: { input: { id } },
      });
      setRefresh(r => r + 1);
    } catch (err) {
      alert('Error deleting coach: ' + (err.message || err));
    } finally {
      setDeletingId(null);
    }
  };

  const handleAssignTeam = async (coach, teamID) => {
    const client = generateClient();
    await client.graphql({
      query: updateCoach,
      variables: { input: { id: coach.id, teamID: teamID || null } }
    });
    setRefresh(r => r + 1);
  };

  if (loading) return <div>Loading coaches...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container">
      <h1>Coaches</h1>
      <button onClick={() => setShowCreate(true)} style={{ marginBottom: 16 }}>+ Add Coach</button>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Name</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ccc' }}>Team ID</th>
            <th style={{ borderBottom: '1px solid #ccc' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coaches.map(coach => (
            <tr key={coach.id}>
              <td>{coach.name}</td>
              <td>
                <select
                  value={coach.teamID || ''}
                  onChange={e => handleAssignTeam(coach, e.target.value)}
                >
                  <option value=''>-- Unassigned --</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => setEditCoach(coach)} style={{ marginRight: 8 }}>Edit</button>
                <button onClick={() => handleDelete(coach.id)} disabled={deletingId === coach.id} style={{ color: 'red' }}>
                  {deletingId === coach.id ? 'Deleting...' : 'Delete'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Create Modal */}
      <SimpleModal isOpen={showCreate} onClose={() => setShowCreate(false)}>
        <h2>Add Coach</h2>
        <CoachCreateForm
          onSuccess={() => { setShowCreate(false); setRefresh(r => r + 1); }}
          onError={err => alert('Error creating coach: ' + err)}
          onSubmit={fields => fields}
        />
      </SimpleModal>
      {/* Edit Modal */}
      <SimpleModal isOpen={!!editCoach} onClose={() => setEditCoach(null)}>
        <h2>Edit Coach</h2>
        {editCoach && (
          <CoachUpdateForm
            id={editCoach.id}
            coach={editCoach}
            onSuccess={() => { setEditCoach(null); setRefresh(r => r + 1); }}
            onError={err => alert('Error updating coach: ' + err)}
            onSubmit={fields => fields}
          />
        )}
      </SimpleModal>
    </div>
  );
} 