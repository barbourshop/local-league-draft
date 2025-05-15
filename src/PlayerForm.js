import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getPlayer, listPlayers } from './graphql/queries';
import { createPlayer, updatePlayer, deletePlayer } from './graphql/mutations';

const columns = [
  { key: 'name', label: 'Name' },
  { key: 'schoolGrade', label: 'School Grade' },
  { key: 'overallRank', label: 'Overall Rank' },
  { key: 'offenseRank', label: 'Offense Rank' },
  { key: 'defenseRank', label: 'Defense Rank' },
  { key: 'slottedRound', label: 'Slotted Round' },
  { key: 'firstTimePlayer', label: 'First Time Player', type: 'checkbox' },
  { key: 'clubPlayer', label: 'Club Player', type: 'checkbox' },
];

const client = generateClient();

export default function PlayerForm({ mode, onSave }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(mode === 'edit');
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const requiredFields = ['name', 'schoolGrade'];

  const allowedFields = [
    'id',
    'name',
    'schoolGrade',
    'overallRank',
    'offenseRank',
    'defenseRank',
    'slottedRound',
    'firstTimePlayer',
    'clubPlayer',
  ];

  useEffect(() => {
    if (mode === 'edit' && id) {
      setLoading(true);
      client.graphql({
        query: getPlayer,
        variables: { id },
      })
        .then(result => {
          setForm(result.data.getPlayer || {});
        })
        .catch(err => setError(err.message || 'Error fetching player'))
        .finally(() => setLoading(false));
    }
  }, [mode, id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    // Validation
    for (const key of requiredFields) {
      if (!form[key] || (key === 'schoolGrade' && isNaN(Number(form[key])))) {
        setError(`${columns.find(c => c.key === key).label} is required${key === 'schoolGrade' ? ' and must be a number' : ''}.`);
        setSaving(false);
        return;
      }
    }
    try {
      // Only include allowed fields in the input
      const input = {};
      allowedFields.forEach(key => {
        if (form[key] !== undefined) input[key] = form[key];
      });
      // Convert numeric fields
      ['schoolGrade', 'slottedRound'].forEach(key => {
        if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
          input[key] = Number(input[key]);
        }
      });
      if (mode === 'edit') {
        input.id = id;
        await client.graphql({
          query: updatePlayer,
          variables: { input },
        });
      } else {
        await client.graphql({
          query: createPlayer,
          variables: { input },
        });
      }
      if (onSave) onSave();
      navigate('/');
    } catch (err) {
      console.error('Save error:', err);
      let errorMsg = err.message || 'Error saving player';
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMsg += ': ' + err.errors.map(e => e.message).join('; ');
      } else if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
        errorMsg += ': ' + err.data.errors.map(e => e.message).join('; ');
      }
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this player?')) return;
    setDeleting(true);
    setError(null);
    try {
      await client.graphql({
        query: deletePlayer,
        variables: { input: { id } },
      });
      if (onSave) onSave();
      navigate('/');
    } catch (err) {
      console.error('Delete error:', err);
      let errorMsg = err.message || 'Error deleting player';
      if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
        errorMsg += ': ' + err.errors.map(e => e.message).join('; ');
      } else if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
        errorMsg += ': ' + err.data.errors.map(e => e.message).join('; ');
      }
      setError(errorMsg);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="container" style={{ maxWidth: 500, marginTop: 40 }}>
      <h2>{mode === 'edit' ? 'Edit Player' : 'Create New Player'}</h2>
      {error && <div style={{ color: 'red', marginBottom: 16 }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        {columns.map(col => (
          <div key={col.key} style={{ marginBottom: 18 }}>
            <label style={{ display: 'block', fontWeight: 500, marginBottom: 4 }}>
              {col.label}
            </label>
            {col.type === 'checkbox' ? (
              <input
                type="checkbox"
                name={col.key}
                checked={!!form[col.key]}
                onChange={handleChange}
                disabled={saving || deleting}
              />
            ) : (
              <input
                type={col.key === 'schoolGrade' || col.key === 'slottedRound' ? 'number' : 'text'}
                name={col.key}
                value={form[col.key] ?? ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, fontSize: '1em' }}
                disabled={saving || deleting}
              />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24 }}>
          {mode === 'edit' && (
            <button type="button" onClick={handleDelete} disabled={deleting} style={{ color: 'red' }}>
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
          <button type="submit" disabled={saving} style={{ marginLeft: 'auto' }}>
            {saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  );
} 