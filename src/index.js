import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Amplify } from 'aws-amplify';
import awsExports from './aws-exports';
import { generateClient } from 'aws-amplify/api';
import { listPlayerEvaluations } from './graphql/queries';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
  useParams
} from 'react-router-dom';
import PlayerForm from './PlayerForm';

Amplify.configure(awsExports);

const client = generateClient();

const columns = [
  { key: 'playerId', label: 'Player ID' },
  { key: 'schoolGrade', label: 'School Grade' },
  { key: 'overallRank', label: 'Overall Rank' },
  { key: 'offenseRank', label: 'Offense Rank' },
  { key: 'defenseRank', label: 'Defense Rank' },
  { key: 'slottedRound', label: 'Slotted Round' },
  { key: 'firstTimePlayer', label: 'First Time Player' },
  { key: 'clubPlayer', label: 'Club Player' },
];

function PlayerTable({ evaluations, loading, error, filters, setFilters, notFilters, setNotFilters, sortConfig, setSortConfig }) {
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

  const filteredEvaluations = evaluations.filter(ev =>
    columns.every(col => {
      const filterValue = filters[col.key];
      const not = notFilters[col.key];
      if (!filterValue) return true;
      let cellValue = ev[col.key];
      if (typeof cellValue === 'boolean') {
        cellValue = cellValue ? 'Yes' : 'No';
      }
      const match = String(cellValue || '').toLowerCase().includes(filterValue.toLowerCase());
      return not ? !match : match;
    })
  );

  const sortedEvaluations = React.useMemo(() => {
    if (!sortConfig.key) return filteredEvaluations;
    const sorted = [...filteredEvaluations];
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
  }, [filteredEvaluations, sortConfig]);

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
          {sortedEvaluations.map(ev => (
            <tr key={ev.id}>
              {columns.map(col => (
                <td key={col.key}>
                  {col.key === 'playerId' ? (
                    <Link to={`/edit/${ev.id}`}>{typeof ev[col.key] === 'boolean' ? (ev[col.key] ? 'Yes' : 'No') : ev[col.key]}</Link>
                  ) : (
                    typeof ev[col.key] === 'boolean' ? (ev[col.key] ? 'Yes' : 'No') : ev[col.key]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div style={{ marginTop: 32, textAlign: 'right' }}>
        <Link to="/new" style={{ fontWeight: 600, fontSize: '1.1em', textDecoration: 'underline' }}>
          + Create New Player
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [evaluations, setEvaluations] = useState([]);
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
        const result = await client.graphql({
          query: listPlayerEvaluations,
        });
        setEvaluations(result.data.listPlayerEvaluations.items);
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
      <Routes>
        <Route
          path="/"
          element={
            <PlayerTable
              evaluations={evaluations}
              loading={loading}
              error={error}
              filters={filters}
              setFilters={setFilters}
              notFilters={notFilters}
              setNotFilters={setNotFilters}
              sortConfig={sortConfig}
              setSortConfig={setSortConfig}
            />
          }
        />
        <Route path="/new" element={<PlayerForm mode="new" onSave={handleRefresh} />} />
        <Route path="/edit/:id" element={<PlayerForm mode="edit" onSave={handleRefresh} />} />
      </Routes>
    </Router>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />); 