import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { generateClient } from 'aws-amplify/api';
import { getPlayerEvaluation } from './graphql/queries';
import { createPlayerEvaluation, updatePlayerEvaluation, deletePlayerEvaluation } from './graphql/mutations';

const columns = [
  { key: 'playerId', label: 'Player ID' },
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

  const requiredNumericFields = ['playerId', 'schoolGrade'];

  const allowedFields = [
    'id',
    'playerId',
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
        query: getPlayerEvaluation,
        variables: { id },
      })
        .then(result => {
          setForm(result.data.getPlayerEvaluation || {});
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
    for (const key of requiredNumericFields) {
      if (!form[key] || isNaN(Number(form[key]))) {
        setError(`${columns.find(c => c.key === key).label} is required and must be a number.`);
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
      ['playerId', 'schoolGrade', 'slottedRound'].forEach(key => {
        if (input[key] !== undefined && input[key] !== null && input[key] !== '') {
          input[key] = Number(input[key]);
        }
      });
      if (mode === 'edit') {
        input.id = id;
        await client.graphql({
          query: updatePlayerEvaluation,
          variables: { input },
        });
      } else {
        await client.graphql({
          query: createPlayerEvaluation,
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
        query: deletePlayerEvaluation,
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
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

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
                type="text"
                name={col.key}
                value={form[col.key] ?? ''}
                onChange={handleChange}
                style={{ width: '100%', padding: 8, fontSize: '1em' }}
                disabled={saving || deleting}
              />
            )}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 16, marginTop: 32 }}>
          <button type="submit" style={{ padding: '8px 20px', fontWeight: 600 }} disabled={saving || deleting}>{saving ? 'Saving...' : 'Save'}</button>
          <button type="button" style={{ padding: '8px 20px' }} onClick={() => navigate(-1)} disabled={saving || deleting}>Cancel</button>
          {mode === 'edit' && (
            <button type="button" style={{ padding: '8px 20px', color: 'white', background: '#d32f2f', fontWeight: 600 }} onClick={handleDelete} disabled={saving || deleting}>{deleting ? 'Deleting...' : 'Delete'}</button>
          )}
        </div>
      </form>
    </div>
  );
} 